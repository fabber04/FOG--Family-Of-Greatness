from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Database URL - use DATABASE_URL from environment (Railway provides this) or default to SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./fog_platform.db")

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
engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args
)

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
