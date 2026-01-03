#!/usr/bin/env python3
"""
Initialize Railway database tables
This script creates all tables in the Railway PostgreSQL database
"""

import os
import sys

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Set Railway DATABASE_URL
RAILWAY_DATABASE_URL = "postgresql://postgres:uJfgOyLyqoeBVIxRbpFklOBtbAwLiMgK@postgres.railway.internal:5432/railway"

# Override database URL for Railway
os.environ["DATABASE_URL"] = RAILWAY_DATABASE_URL

from database import engine, SessionLocal
from models import Base
from sqlalchemy import inspect

def create_tables():
    """Create all database tables."""
    print("🔗 Connecting to Railway database...")
    print(f"   Database: {RAILWAY_DATABASE_URL.split('@')[1] if '@' in RAILWAY_DATABASE_URL else 'railway'}")
    
    try:
        # Test connection
        print("   Testing connection...")
        with engine.connect() as conn:
            print("✅ Database connection successful!")
        
        # Create all tables
        print("\n📋 Creating database tables...")
        Base.metadata.create_all(bind=engine)
        
        # Verify tables were created
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        print(f"\n✅ Successfully created {len(tables)} tables:")
        for table in sorted(tables):
            print(f"   - {table}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error creating tables: {e}")
        import traceback
        traceback.print_exc()
        
        # Check if it's a connection error
        if "railway.internal" in str(e) or "could not translate host name" in str(e).lower():
            print("\n⚠️  Note: The internal Railway URL won't work from outside Railway's network.")
            print("   Options:")
            print("   1. Get the public DATABASE_URL from Railway dashboard")
            print("   2. Use Railway CLI: railway run python init_railway_tables.py")
            print("   3. Use the API endpoint: curl -X POST https://fog-family-of-greatness-production.up.railway.app/api/init-db")
        
        return False

if __name__ == "__main__":
    print("🚀 Initializing Railway database tables...\n")
    success = create_tables()
    
    if success:
        print("\n✅ Database initialization complete!")
        print("   You can now run: python upload_podcasts.py")
    else:
        print("\n❌ Database initialization failed!")
        sys.exit(1)

