from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uvicorn
from dotenv import load_dotenv
import os

from database import engine, get_db
from models import Base
from routes import auth, library, users, prayer, events, podcasts, courses, devotionals, announcements
from utils.auth import get_current_user
from file_server import initialize_storage, STORAGE_DIR

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize file storage
try:
    initialize_storage()
except Exception as e:
    print(f" Warning: File storage initialization failed: {e}")
    print("   Server will continue, but file uploads may not work properly")

app = FastAPI(
    title="FOG API",
    description="Backend API for FOG (Faith-based Organization) Platform",
    version="1.0.0"
)

# CORS middleware
# Get allowed origins from environment or use defaults
cors_origins = os.getenv("CORS_ORIGINS", "").split(",") if os.getenv("CORS_ORIGINS") else []
default_origins = [
    "http://localhost:3000", 
    "http://localhost:3001",
    "http://localhost:3002",  # Additional React dev server port
    "https://fabber04.github.io"  # GitHub Pages deployment
]
# Combine default origins with environment origins, filter out empty strings
allow_origins = default_origins + [origin.strip() for origin in cors_origins if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Mount static files for uploaded content
# Legacy uploads directory (for backward compatibility)
os.makedirs("uploads", exist_ok=True)
os.makedirs("uploads/events", exist_ok=True)
os.makedirs("uploads/podcasts", exist_ok=True)
os.makedirs("uploads/podcasts/audio", exist_ok=True)
os.makedirs("uploads/courses", exist_ok=True)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Mount file server storage directory
# This serves files from the centralized storage location
try:
    storage_path = str(STORAGE_DIR)
    if os.path.exists(storage_path):
        app.mount("/storage", StaticFiles(directory=storage_path), name="storage")
        print(f"Storage mounted at /storage from {storage_path}")
    else:
        print(f"Warning: Storage directory not found: {storage_path}")
except Exception as e:
    print(f" Warning: Failed to mount storage: {e}")

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(library.router, prefix="/api/library", tags=["Library"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(prayer.router, prefix="/api/prayer", tags=["Prayer Requests"])
app.include_router(events.router, prefix="/api/events", tags=["Events"])
app.include_router(podcasts.router, prefix="/api/podcasts", tags=["Podcasts"])
app.include_router(courses.router, prefix="/api/courses", tags=["Genius Academy Courses"])
app.include_router(devotionals.router, prefix="/api/devotionals", tags=["Devotionals"])
app.include_router(announcements.router, prefix="/api/announcements", tags=["Announcements"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to FOG API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "FOG API is running"}

@app.get("/api/test-db")
async def test_database(db: Session = Depends(get_db)):
    """Test database connection and table existence."""
    try:
        from models import Podcast
        # Try to query the podcasts table
        count = db.query(Podcast).count()
        return {
            "status": "success",
            "message": "Database connection successful",
            "podcasts_count": count,
            "tables_exist": True
        }
    except Exception as e:
        import traceback
        return {
            "status": "error",
            "message": f"Database error: {str(e)}",
            "tables_exist": False,
            "traceback": traceback.format_exc()
        }

if __name__ == "__main__":
    try:
        # Get port from environment (Railway provides this) or default to 8000
        port = int(os.getenv("PORT", 8000))
        # Only enable reload in development
        reload = os.getenv("ENVIRONMENT", "production") != "production"
        
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=port,
            reload=reload,
            log_level="info"
        )
    except Exception as e:
        print(f"Server failed to start: {e}")
        import traceback
        traceback.print_exc()
        raise
