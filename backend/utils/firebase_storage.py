"""
Firebase Storage Utilities
Handles file uploads to Firebase Storage
"""
import os
import uuid
from typing import Optional, BinaryIO
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

try:
    import firebase_admin
    from firebase_admin import credentials, storage as firebase_storage
    FIREBASE_AVAILABLE = True
except ImportError:
    FIREBASE_AVAILABLE = False
    print("⚠️ Firebase Admin SDK not installed. Install with: pip install firebase-admin")

# Firebase configuration
FIREBASE_STORAGE_BUCKET = os.getenv("FIREBASE_STORAGE_BUCKET")
FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS")

# Initialize Firebase Admin if not already initialized
def initialize_firebase():
    """Initialize Firebase Admin SDK."""
    if not FIREBASE_AVAILABLE:
        return False
    
    if firebase_admin._apps:
        return True  # Already initialized
    
    try:
        if FIREBASE_CREDENTIALS_PATH and os.path.exists(FIREBASE_CREDENTIALS_PATH):
            # Use service account credentials file
            cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
            firebase_admin.initialize_app(cred, {
                'storageBucket': FIREBASE_STORAGE_BUCKET
            })
        else:
            # Try to use default credentials (for cloud environments like GCP)
            try:
                firebase_admin.initialize_app(options={
                    'storageBucket': FIREBASE_STORAGE_BUCKET
                })
            except Exception as e:
                print(f"⚠️ Could not initialize Firebase with default credentials: {e}")
                print("💡 Set FIREBASE_CREDENTIALS environment variable with path to service account JSON")
                return False
        
        print("✅ Firebase Admin initialized successfully")
        return True
    except Exception as e:
        print(f"❌ Error initializing Firebase Admin: {e}")
        return False

# Initialize on import
_firebase_initialized = initialize_firebase()

def upload_file_to_firebase(
    file_content: bytes,
    file_name: str,
    folder_path: str = "podcasts",
    content_type: Optional[str] = None
) -> Optional[str]:
    """
    Upload a file to Firebase Storage.
    
    Args:
        file_content: Binary content of the file
        file_name: Original filename
        folder_path: Folder path in Firebase Storage (e.g., "podcasts/audio", "podcasts/covers")
        content_type: MIME type of the file (e.g., "audio/m4a", "image/jpeg")
    
    Returns:
        Public URL of the uploaded file, or None if upload failed
    """
    if not FIREBASE_AVAILABLE:
        print("⚠️ Firebase Admin SDK not available. Cannot upload to Firebase Storage.")
        return None
    
    if not _firebase_initialized:
        print("⚠️ Firebase not initialized. Cannot upload to Firebase Storage.")
        return None
    
    try:
        # Get storage bucket
        bucket = firebase_storage.bucket()
        
        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_extension = os.path.splitext(file_name)[1]
        unique_filename = f"{timestamp}_{uuid.uuid4().hex[:8]}{file_extension}"
        
        # Create blob path
        blob_path = f"{folder_path}/{unique_filename}"
        blob = bucket.blob(blob_path)
        
        # Set content type if provided
        if content_type:
            blob.content_type = content_type
        
        # Upload file
        blob.upload_from_string(file_content, content_type=content_type)
        
        # Make the file publicly accessible
        blob.make_public()
        
        # Get public URL
        public_url = blob.public_url
        
        print(f"✅ File uploaded to Firebase Storage: {blob_path}")
        return public_url
    
    except Exception as e:
        print(f"❌ Error uploading file to Firebase Storage: {e}")
        return None

def upload_file_from_path(
    file_path: str,
    folder_path: str = "podcasts",
    content_type: Optional[str] = None
) -> Optional[str]:
    """
    Upload a file from local path to Firebase Storage.
    
    Args:
        file_path: Local file path
        folder_path: Folder path in Firebase Storage
        content_type: MIME type of the file
    
    Returns:
        Public URL of the uploaded file, or None if upload failed
    """
    try:
        with open(file_path, "rb") as f:
            file_content = f.read()
        
        file_name = os.path.basename(file_path)
        return upload_file_to_firebase(file_content, file_name, folder_path, content_type)
    
    except Exception as e:
        print(f"❌ Error reading file for upload: {e}")
        return None

def delete_file_from_firebase(file_url: str) -> bool:
    """
    Delete a file from Firebase Storage using its URL.
    
    Args:
        file_url: Public URL of the file
    
    Returns:
        True if deletion successful, False otherwise
    """
    if not FIREBASE_AVAILABLE or not _firebase_initialized:
        return False
    
    try:
        bucket = firebase_storage.bucket()
        
        # Extract blob path from URL
        # URL format: https://firebasestorage.googleapis.com/v0/b/BUCKET/o/path%2Fto%2Ffile
        if "firebasestorage.googleapis.com" in file_url:
            # Parse the URL to get the blob path
            from urllib.parse import urlparse, unquote
            parsed = urlparse(file_url)
            # The path is usually /v0/b/BUCKET/o/path%2Fto%2Ffile
            path_parts = parsed.path.split("/o/")
            if len(path_parts) > 1:
                blob_path = unquote(path_parts[1])
                blob = bucket.blob(blob_path)
                blob.delete()
                print(f"✅ File deleted from Firebase Storage: {blob_path}")
                return True
        
        return False
    
    except Exception as e:
        print(f"❌ Error deleting file from Firebase Storage: {e}")
        return False

def get_content_type_from_filename(filename: str) -> str:
    """
    Determine content type from file extension.
    
    Args:
        filename: Name of the file
    
    Returns:
        MIME type string
    """
    extension = os.path.splitext(filename)[1].lower()
    
    content_types = {
        # Audio
        ".mp3": "audio/mpeg",
        ".m4a": "audio/mp4",
        ".wav": "audio/wav",
        ".ogg": "audio/ogg",
        ".aac": "audio/aac",
        ".mp4": "audio/mp4",
        # Images
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp",
    }
    
    return content_types.get(extension, "application/octet-stream")

