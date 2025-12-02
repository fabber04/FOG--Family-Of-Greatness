from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
from datetime import datetime

from database import get_db
from models import Podcast, User
from schemas import PodcastCreate, PodcastUpdate, Podcast as PodcastSchema
from utils.auth import get_current_user, get_current_admin_user

router = APIRouter()

# File upload configuration
UPLOAD_DIR = "uploads/podcasts"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif"}

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

def is_valid_file_extension(filename: str) -> bool:
    """Check if file has valid extension."""
    return any(filename.lower().endswith(ext) for ext in ALLOWED_EXTENSIONS)

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
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new podcast (admin only)."""
    db_podcast = Podcast(
        **podcast_data.dict(),
        created_by=current_user.id
    )
    
    db.add(db_podcast)
    db.commit()
    db.refresh(db_podcast)
    
    return db_podcast

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
    
    # Delete associated cover image if exists
    if db_podcast.cover:
        try:
            file_path = os.path.join(UPLOAD_DIR, db_podcast.cover)
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Error deleting file: {e}")
    
    db.delete(db_podcast)
    db.commit()
    
    return {"message": "Podcast deleted successfully"}

@router.post("/upload-cover")
async def upload_podcast_cover(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_admin_user)
):
    """Upload a cover image for podcasts (admin only)."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    if not is_valid_file_extension(file.filename):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Generate unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"podcast_{timestamp}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")
    
    return {"filename": filename, "url": f"/uploads/podcasts/{filename}"}

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
