#!/usr/bin/env python3
"""
Check Railway PostgreSQL database tables and data
"""

import os
import sys

# You'll need to get the DATABASE_URL from Railway
# Go to Railway → PostgreSQL service → Variables tab → Copy DATABASE_URL
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("❌ DATABASE_URL not set!")
    print("\nTo get your Railway DATABASE_URL:")
    print("1. Go to Railway dashboard")
    print("2. Click on your PostgreSQL service")
    print("3. Go to 'Variables' tab")
    print("4. Copy the DATABASE_URL value")
    print("\nThen run:")
    print("  export DATABASE_URL='postgresql://...'")
    print("  python check_railway_db.py")
    sys.exit(1)

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker

# Create engine
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

print("🔗 Connecting to Railway PostgreSQL database...")
print(f"   Database: {DATABASE_URL.split('@')[1] if '@' in DATABASE_URL else 'railway'}\n")

try:
    # Get inspector
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    print(f"✅ Found {len(tables)} tables:\n")
    
    db = SessionLocal()
    try:
        for table in sorted(tables):
            # Get row count
            result = db.execute(text(f"SELECT COUNT(*) FROM {table}"))
            count = result.scalar()
            
            # Get column names
            columns = [col['name'] for col in inspector.get_columns(table)]
            
            print(f"📋 {table}")
            print(f"   Rows: {count}")
            print(f"   Columns: {', '.join(columns[:5])}{'...' if len(columns) > 5 else ''}")
            print()
        
        # Show sample data from podcasts
        if 'podcasts' in tables:
            print("📻 Sample Podcasts:")
            result = db.execute(text("SELECT id, title, category FROM podcasts LIMIT 5"))
            for row in result:
                print(f"   [{row[0]}] {row[1]} ({row[2]})")
            print()
            
    finally:
        db.close()
    
    print("✅ Database check complete!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

