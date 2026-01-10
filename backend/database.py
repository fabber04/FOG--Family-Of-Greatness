from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Database URL - use DATABASE_URL from environment (Railway provides this) or default to SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "")

# Handle Railway's PostgreSQL URL format
# Railway sometimes provides postgres:// which needs to be converted to postgresql://
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# If DATABASE_URL is empty or invalid, fall back to SQLite
if not DATABASE_URL or not DATABASE_URL.strip():
    print("⚠️  WARNING: DATABASE_URL not set, using SQLite (not recommended for production)")
    DATABASE_URL = "sqlite:///./fog_platform.db"

# Validate DATABASE_URL format
if not (DATABASE_URL.startswith("sqlite://") or 
        DATABASE_URL.startswith("postgresql://") or 
        DATABASE_URL.startswith("postgres://")):
    raise ValueError(
        f"Invalid DATABASE_URL format: {DATABASE_URL[:20]}...\n"
        "Expected format: postgresql://user:pass@host:port/dbname or sqlite:///./file.db"
    )

# For PostgreSQL (Railway), DATABASE_URL is already in the correct format
# For SQLite, we need to handle the connection args
if DATABASE_URL.startswith("sqlite"):
    # SQLite connection args
    connect_args = {"check_same_thread": False}
else:
    # PostgreSQL and other databases don't need special connection args
    # Railway's DATABASE_URL format: postgresql://user:pass@host:port/dbname
    connect_args = {}

# Create engine
try:
    engine = create_engine(
        DATABASE_URL,
        connect_args=connect_args
    )
    print(f"✅ Database engine created successfully")
    print(f"   Database type: {'SQLite' if DATABASE_URL.startswith('sqlite') else 'PostgreSQL'}")
except Exception as e:
    print(f"❌ Error creating database engine: {e}")
    print(f"   DATABASE_URL: {DATABASE_URL[:50]}..." if len(DATABASE_URL) > 50 else f"   DATABASE_URL: {DATABASE_URL}")
    raise

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
