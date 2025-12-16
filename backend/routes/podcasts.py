from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
from datetime import datetime
import httpx
import re

from database import get_db
from models import Podcast, User
from schemas import PodcastCreate, PodcastUpdate, Podcast as PodcastSchema
from utils.auth import get_current_user, get_current_admin_user
from file_server import (
    save_file,
    delete_file as delete_storage_file,
    get_mime_type,
    validate_file_extension
)

router = APIRouter()

# File upload configuration
UPLOAD_DIR = "uploads/podcasts"
AUDIO_DIR = "uploads/podcasts/audio"
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif"}
ALLOWED_AUDIO_EXTENSIONS = {".mp3", ".m4a", ".wav", ".ogg", ".aac", ".mp4"}

# Storage mode: "firebase" or "local" (default to local Python file server)
STORAGE_MODE = os.getenv("STORAGE_MODE", "local").lower()

# Ensure upload directories exist (for local fallback)
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(AUDIO_DIR, exist_ok=True)

def is_valid_file_extension(filename: str, file_type: str = "image") -> bool:
    """Check if file has valid extension."""
    allowed = ALLOWED_AUDIO_EXTENSIONS if file_type == "audio" else ALLOWED_IMAGE_EXTENSIONS
    return any(filename.lower().endswith(ext) for ext in allowed)

@router.get("/", response_model=List[PodcastSchema])
async def get_podcasts(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    type_filter: Optional[str] = None,
    is_live: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all podcasts with optional filtering."""
    query = db.query(Podcast)
    
    if category and category != "all":
        query = query.filter(Podcast.category == category)
    
    if type_filter and type_filter != "all":
        query = query.filter(Podcast.type == type_filter)
    
    if is_live is not None:
        query = query.filter(Podcast.is_live == is_live)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Podcast.title.ilike(search_term)) |
            (Podcast.host.ilike(search_term)) |
            (Podcast.description.ilike(search_term))
        )
    
    # Order by publish date (newest first)
    query = query.order_by(Podcast.publish_date.desc())
    
    podcasts = query.offset(skip).limit(limit).all()
    return podcasts

@router.get("/{podcast_id}", response_model=PodcastSchema)
async def get_podcast(podcast_id: int, db: Session = Depends(get_db)):
    """Get a specific podcast by ID."""
    podcast = db.query(Podcast).filter(Podcast.id == podcast_id).first()
    if not podcast:
        raise HTTPException(status_code=404, detail="Podcast not found")
    
    # Increment plays count
    podcast.plays += 1
    db.commit()
    
    return podcast

@router.post("/", response_model=PodcastSchema)
async def create_podcast(
    podcast_data: PodcastCreate,
    # Temporarily disabled auth for content upload
    # current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new podcast (admin only)."""
    try:
        db_podcast = Podcast(
            **podcast_data.dict(),
            created_by=None  # Temporary: disabled auth, no user required
        )
        
        db.add(db_podcast)
        db.commit()
        db.refresh(db_podcast)
        
        return db_podcast
    except Exception as e:
        db.rollback()
        import traceback
        error_detail = str(e)
        traceback_str = traceback.format_exc()
        print(f"Error creating podcast: {error_detail}")
        print(f"Traceback: {traceback_str}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create podcast: {error_detail}"
        )

@router.put("/{podcast_id}", response_model=PodcastSchema)
async def update_podcast(
    podcast_id: int,
    podcast_data: PodcastUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update a podcast (admin only)."""
    db_podcast = db.query(Podcast).filter(Podcast.id == podcast_id).first()
    if not db_podcast:
        raise HTTPException(status_code=404, detail="Podcast not found")
    
    update_data = podcast_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_podcast, field, value)
    
    db_podcast.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_podcast)
    
    return db_podcast

@router.delete("/{podcast_id}")
async def delete_podcast(
    podcast_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a podcast (admin only)."""
    db_podcast = db.query(Podcast).filter(Podcast.id == podcast_id).first()
    if not db_podcast:
        raise HTTPException(status_code=404, detail="Podcast not found")
    
    # Delete associated files from storage
    if db_podcast.cover:
        try:
            # Try Python file server first
            if db_podcast.cover.startswith("/storage/"):
                delete_storage_file(db_podcast.cover)
            # Try Firebase Storage
            elif db_podcast.cover.startswith("http") and "firebasestorage" in db_podcast.cover:
                from utils.firebase_storage import delete_file_from_firebase
                delete_file_from_firebase(db_podcast.cover)
            # Legacy local file
            else:
                file_path = os.path.join(UPLOAD_DIR, db_podcast.cover)
                if os.path.exists(file_path):
                    os.remove(file_path)
        except Exception as e:
            print(f"Error deleting cover file: {e}")
    
    if db_podcast.audio_url:
        try:
            # Try Python file server first
            if db_podcast.audio_url.startswith("/storage/"):
                delete_storage_file(db_podcast.audio_url)
            # Try Firebase Storage
            elif db_podcast.audio_url.startswith("http") and "firebasestorage" in db_podcast.audio_url:
                from utils.firebase_storage import delete_file_from_firebase
                delete_file_from_firebase(db_podcast.audio_url)
            # Legacy local file
            elif db_podcast.audio_url.startswith("/uploads/"):
                file_path = db_podcast.audio_url.lstrip("/")
                if os.path.exists(file_path):
                    os.remove(file_path)
        except Exception as e:
            print(f"Error deleting audio file: {e}")
    
    db.delete(db_podcast)
    db.commit()
    
    return {"message": "Podcast deleted successfully"}

@router.post("/upload-cover")
async def upload_podcast_cover(
    file: UploadFile = File(...)
    # Temporarily disabled auth for content upload
    # current_user: User = Depends(get_current_admin_user),
):
    """Upload a cover image for podcasts (admin only)."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    if not is_valid_file_extension(file.filename, "image"):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}"
        )
    
    # Read file content
    file_content = await file.read()
    
    # Use Python file server (default)
    if STORAGE_MODE == "local":
        file_path, public_url = save_file(
            file_content=file_content,
            original_filename=file.filename,
            category="podcasts",
            subcategory="covers",
            file_type="image",
            preserve_filename=True
        )
        
        if file_path and public_url:
            return {"filename": file.filename, "url": public_url}
        else:
            raise HTTPException(status_code=500, detail="Failed to save file to storage")
    
    # Firebase Storage (if enabled)
    elif STORAGE_MODE == "firebase":
        from utils.firebase_storage import upload_file_to_firebase, get_content_type_from_filename
        content_type = get_content_type_from_filename(file.filename)
        firebase_url = upload_file_to_firebase(
            file_content=file_content,
            file_name=file.filename,
            folder_path="podcasts/covers",
            content_type=content_type
        )
        
        if firebase_url:
            return {"filename": file.filename, "url": firebase_url}
        else:
            raise HTTPException(status_code=500, detail="Failed to upload to Firebase Storage")
    
    # Legacy local storage fallback
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"podcast_cover_{timestamp}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(file_content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")
    
    return {"filename": filename, "url": f"/uploads/podcasts/{filename}"}

@router.post("/upload-audio")
async def upload_podcast_audio(
    file: UploadFile = File(...)
    # Temporarily disabled auth for content upload
    # current_user: User = Depends(get_current_admin_user),
):
    """Upload an audio file for podcasts (admin only)."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    if not is_valid_file_extension(file.filename, "audio"):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid audio file type. Allowed: {', '.join(ALLOWED_AUDIO_EXTENSIONS)}"
        )
    
    # Read file content
    file_content = await file.read()
    
    # Use Python file server (default)
    if STORAGE_MODE == "local":
        file_path, public_url = save_file(
            file_content=file_content,
            original_filename=file.filename,
            category="podcasts",
            subcategory="audio",
            file_type="audio",
            preserve_filename=True
        )
        
        if file_path and public_url:
            return {"filename": file.filename, "url": public_url}
        else:
            raise HTTPException(status_code=500, detail="Failed to save audio file to storage")
    
    # Firebase Storage (if enabled)
    elif STORAGE_MODE == "firebase":
        from utils.firebase_storage import upload_file_to_firebase, get_content_type_from_filename
        content_type = get_content_type_from_filename(file.filename)
        firebase_url = upload_file_to_firebase(
            file_content=file_content,
            file_name=file.filename,
            folder_path="podcasts/audio",
            content_type=content_type
        )
        
        if firebase_url:
            return {"filename": file.filename, "url": firebase_url}
        else:
            raise HTTPException(status_code=500, detail="Failed to upload to Firebase Storage")
    
    # Legacy local storage fallback
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"podcast_audio_{timestamp}{file_extension}"
    file_path = os.path.join(AUDIO_DIR, filename)
    
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(file_content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving audio file: {str(e)}")
    
    return {"filename": filename, "url": f"/uploads/podcasts/audio/{filename}"}

@router.get("/categories/list")
async def get_categories(db: Session = Depends(get_db)):
    """Get all available podcast categories."""
    categories = db.query(Podcast.category).distinct().all()
    return [cat[0] for cat in categories if cat[0]]

@router.get("/types/list")
async def get_types(db: Session = Depends(get_db)):
    """Get all available podcast types."""
    types = db.query(Podcast.type).distinct().all()
    return [t[0] for t in types if t[0]]

def extract_drive_file_id(url: str) -> Optional[str]:
    """Extract file ID from Google Drive URL."""
    if not url:
        return None
    
    # Pattern 1: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    match = re.search(r'/file/d/([a-zA-Z0-9_-]+)', url)
    if match:
        return match.group(1)
    
    # Pattern 2: https://drive.google.com/open?id=FILE_ID
    match = re.search(r'[?&]id=([a-zA-Z0-9_-]+)', url)
    if match:
        return match.group(1)
    
    # Pattern 3: Just the file ID
    if re.match(r'^[a-zA-Z0-9_-]+$', url):
        return url
    
    return None

@router.get("/{podcast_id}/stream")
async def stream_podcast_audio(
    podcast_id: int,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Stream podcast audio through backend proxy to prevent direct downloads.
    Supports both local uploaded files and Google Drive links.
    Content is available to users, but downloads are restricted via headers.
    """
    # Get podcast
    podcast = db.query(Podcast).filter(Podcast.id == podcast_id).first()
    if not podcast:
        raise HTTPException(status_code=404, detail="Podcast not found")
    
    if not podcast.audio_url:
        raise HTTPException(status_code=404, detail="Audio URL not available")
    
    # Check if it's a local file (starts with /uploads/ or /storage/)
    if podcast.audio_url.startswith("/uploads/podcasts/audio/") or podcast.audio_url.startswith("/storage/podcasts/audio/"):
        # Serve local file
        if podcast.audio_url.startswith("/storage/"):
            # New storage location
            from file_server import STORAGE_DIR
            relative_path = podcast.audio_url.replace("/storage/", "")
            file_path = str(STORAGE_DIR / relative_path)
        else:
            # Legacy uploads location
            file_path = podcast.audio_url.lstrip("/")
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Audio file not found on server")
        
        # Determine media type from file extension
        file_ext = os.path.splitext(file_path)[1].lower()
        media_type_map = {
            ".mp3": "audio/mpeg",
            ".m4a": "audio/mp4",
            ".mp4": "audio/mp4",
            ".wav": "audio/wav",
            ".ogg": "audio/ogg",
            ".aac": "audio/aac"
        }
        media_type = media_type_map.get(file_ext, "audio/mpeg")
        
        # Increment plays count
        podcast.plays += 1
        db.commit()
        
        async def generate_local():
            """Stream audio data from local file."""
            with open(file_path, "rb") as f:
                while True:
                    chunk = f.read(8192)
                    if not chunk:
                        break
                    yield chunk
        
        return StreamingResponse(
            generate_local(),
            media_type=media_type,
            headers={
                "Content-Disposition": "inline",
                "Accept-Ranges": "bytes",
                "Cache-Control": "public, max-age=3600",
                "X-Content-Type-Options": "nosniff",
            }
        )
    
    # Otherwise, it's a Google Drive link - proxy it
    file_id = extract_drive_file_id(podcast.audio_url)
    if not file_id:
        raise HTTPException(status_code=400, detail="Invalid audio URL")
    
    # Convert to streaming URL
    stream_url = f"https://drive.google.com/uc?export=open&id={file_id}"
    
    # Increment plays count
    podcast.plays += 1
    db.commit()
    
    async def generate():
        """Stream audio data from Google Drive."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                async with client.stream('GET', stream_url, follow_redirects=True) as response:
                    if response.status_code != 200:
                        raise HTTPException(
                            status_code=response.status_code,
                            detail="Failed to fetch audio from Google Drive"
                        )
                    
                    async for chunk in response.aiter_bytes(chunk_size=8192):
                        yield chunk
            except httpx.RequestError as e:
                raise HTTPException(status_code=500, detail=f"Error streaming audio: {str(e)}")
    
    # Get content type from request or default to audio/mpeg
    accept_header = request.headers.get("accept", "")
    media_type = "audio/mpeg"
    if "audio/mp3" in accept_header or "audio/mpeg" in accept_header:
        media_type = "audio/mpeg"
    elif "audio/mp4" in accept_header or "audio/m4a" in accept_header:
        media_type = "audio/mp4"
    elif "audio/ogg" in accept_header:
        media_type = "audio/ogg"
    elif "audio/wav" in accept_header:
        media_type = "audio/wav"
    
    return StreamingResponse(
        generate(),
        media_type=media_type,
        headers={
            "Content-Disposition": "inline",
            "Accept-Ranges": "bytes",
            "Cache-Control": "public, max-age=3600",
            "X-Content-Type-Options": "nosniff",
        }
    )
