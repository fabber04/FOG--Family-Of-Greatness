from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uvicorn
from dotenv import load_dotenv
import os

from database import engine, get_db
from models import Base
from sqlalchemy.orm import Session
from routes import auth, library, users, prayer, events, podcasts, courses, devotionals, announcements
from utils.auth import get_current_user
from file_server import initialize_storage, STORAGE_DIR

# Load environment variables
load_dotenv()

# Create database tables
try:
    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully")
    
    # Verify tables were created
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"   Created {len(tables)} tables: {', '.join(sorted(tables))}")
except Exception as e:
    print(f"❌ Error creating database tables: {e}")
    import traceback
    traceback.print_exc()
    # Don't fail startup, but log the error

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
    from sqlalchemy import inspect
    from models import Podcast
    
    try:
        # Test connection and get table names
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        # Try to query
        count = db.query(Podcast).count()
        return {
            "status": "success",
            "message": "Database connection successful",
            "podcasts_count": count,
            "tables_exist": True,
            "tables": tables,
            "database_url": os.getenv("DATABASE_URL", "not set")[:50] + "..." if os.getenv("DATABASE_URL") else "not set"
        }
    except Exception as e:
        import traceback
        return {
            "status": "error",
            "message": f"Database error: {str(e)}",
            "tables_exist": False,
            "traceback": traceback.format_exc(),
            "database_url": os.getenv("DATABASE_URL", "not set")[:50] + "..." if os.getenv("DATABASE_URL") else "not set"
        }

@app.post("/api/init-db")
async def init_database():
    """Manually initialize database tables."""
    try:
        print("Manually initializing database tables...")
        Base.metadata.create_all(bind=engine)
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        return {
            "status": "success",
            "message": "Database tables created successfully",
            "tables": tables,
            "count": len(tables)
        }
    except Exception as e:
        import traceback
        error_msg = str(e)
        tb = traceback.format_exc()
        print(f"Error in init-db: {error_msg}")
        print(tb)
        return {
            "status": "error",
            "message": f"Failed to create tables: {error_msg}",
            "traceback": tb
        }

@app.get("/api/view-tables")
async def view_all_tables(db: Session = Depends(get_db)):
    """View all tables and their data."""
    from sqlalchemy import inspect, text
    
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        result = {}
        
        for table in sorted(tables):
            # Get row count
            count_result = db.execute(text(f"SELECT COUNT(*) FROM {table}"))
            count = count_result.scalar()
            
            # Get column names
            columns = [col['name'] for col in inspector.get_columns(table)]
            
            # Get sample data (first 10 rows)
            if count > 0:
                data_result = db.execute(text(f"SELECT * FROM {table} LIMIT 10"))
                rows = data_result.fetchall()
                
                # Convert rows to dictionaries
                table_data = []
                for row in rows:
                    row_dict = {}
                    for col_name, value in zip(columns, row):
                        # Convert values to JSON-serializable format
                        if value is None:
                            row_dict[col_name] = None
                        elif isinstance(value, (str, int, float, bool)):
                            row_dict[col_name] = value
                        else:
                            row_dict[col_name] = str(value)
                    table_data.append(row_dict)
            else:
                table_data = []
            
            result[table] = {
                "columns": columns,
                "row_count": count,
                "sample_data": table_data,
                "showing": min(10, count) if count > 0 else 0
            }
        
        return {
            "status": "success",
            "tables": result,
            "total_tables": len(tables)
        }
    except Exception as e:
        import traceback
        return {
            "status": "error",
            "message": f"Error viewing tables: {str(e)}",
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
