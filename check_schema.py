#!/usr/bin/env python3
"""
Check database schema and see where the podcasts actually are
"""

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

PUBLIC_URL = "postgresql://postgres:uJfgOyLyqoeBVIxRbpFklOBtbAwLiMgK@turntable.proxy.rlwy.net:49383/railway"

print("🔍 Checking database schema and tables...")
print("=" * 70)

try:
    engine = create_engine(PUBLIC_URL)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    try:
        # Check all schemas
        print("\n📋 Checking schemas:")
        result = db.execute(text("SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('pg_catalog', 'information_schema')"))
        schemas = [row[0] for row in result]
        print(f"   Found schemas: {schemas}")
        
        # Check tables in public schema
        print("\n📋 Tables in 'public' schema:")
        result = db.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        """))
        tables = [row[0] for row in result]
        for table in tables:
            result = db.execute(text(f"SELECT COUNT(*) FROM {table}"))
            count = result.scalar()
            print(f"   • {table:30} {count:>5} rows")
        
        # Check if podcasts table exists and has structure
        print("\n📋 Podcasts table structure:")
        result = db.execute(text("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'podcasts'
            ORDER BY ordinal_position
        """))
        columns = list(result)
        if columns:
            print(f"   Table exists with {len(columns)} columns")
            for col_name, col_type in columns[:5]:
                print(f"   • {col_name}: {col_type}")
        else:
            print("   ❌ Table does not exist!")
        
        # Try to query podcasts directly
        print("\n📋 Direct query test:")
        try:
            result = db.execute(text("SELECT id, title FROM podcasts LIMIT 5"))
            rows = result.fetchall()
            print(f"   Found {len(rows)} podcasts")
            for row in rows:
                print(f"   • [{row[0]}] {row[1][:50]}")
        except Exception as e:
            print(f"   ❌ Error querying: {str(e)[:100]}")
        
    finally:
        db.close()
        
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()

