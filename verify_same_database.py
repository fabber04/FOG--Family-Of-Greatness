#!/usr/bin/env python3
"""
Verify both connections point to the same database and check for data
"""

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Public connection (what we can access)
PUBLIC_URL = "postgresql://postgres:uJfgOyLyqoeBVIxRbpFklOBtbAwLiMgK@turntable.proxy.rlwy.net:49383/railway"

print("🔍 Verifying database connection and data...")
print("=" * 70)

try:
    engine = create_engine(PUBLIC_URL)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    try:
        # Check database name and current database
        print("\n📊 Database Information:")
        result = db.execute(text("SELECT current_database(), current_schema()"))
        db_name, schema = result.fetchone()
        print(f"   Database: {db_name}")
        print(f"   Schema: {schema}")
        
        # Check if podcasts table has any constraints or issues
        print("\n📋 Checking podcasts table:")
        result = db.execute(text("""
            SELECT COUNT(*) as total,
                   COUNT(CASE WHEN id IS NOT NULL THEN 1 END) as with_id,
                   COUNT(CASE WHEN title IS NOT NULL THEN 1 END) as with_title
            FROM podcasts
        """))
        row = result.fetchone()
        print(f"   Total rows: {row[0]}")
        print(f"   Rows with ID: {row[1]}")
        print(f"   Rows with title: {row[2]}")
        
        # Check table size
        result = db.execute(text("""
            SELECT pg_size_pretty(pg_total_relation_size('podcasts')) as size
        """))
        size = result.scalar()
        print(f"   Table size: {size}")
        
        # Try to see if there are any rows at all (even deleted ones)
        result = db.execute(text("SELECT MAX(id) FROM podcasts"))
        max_id = result.scalar()
        print(f"   Max ID: {max_id}")
        
        # Check if there are any sequences
        result = db.execute(text("""
            SELECT last_value FROM podcasts_id_seq
        """))
        try:
            seq_value = result.scalar()
            print(f"   Sequence value: {seq_value}")
        except:
            print(f"   Sequence: Not found or error")
        
        print("\n💡 The backend shows 21 podcasts, but direct query shows 0.")
        print("   This suggests the backend might be using a different database instance.")
        print("   OR there's a transaction/connection issue.")
        
    finally:
        db.close()
        
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()

