#!/usr/bin/env python3
"""
Check both database connections to see if they're the same
"""

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker

# Internal connection (what backend uses)
INTERNAL_URL = "postgresql://postgres:uJfgOyLyqoeBVIxRbpFklOBtbAwLiMgK@postgres.railway.internal:5432/railway"

# Public connection (what we're viewing)
PUBLIC_URL = "postgresql://postgres:uJfgOyLyqoeBVIxRbpFklOBtbAwLiMgK@turntable.proxy.rlwy.net:49383/railway"

print("🔍 Comparing both database connections...")
print("=" * 70)

# Try internal connection (might fail from outside Railway)
print("\n1️⃣  Internal Connection (postgres.railway.internal):")
try:
    engine_internal = create_engine(INTERNAL_URL)
    with engine_internal.connect() as conn:
        inspector = inspect(engine_internal)
        tables_internal = inspector.get_table_names()
        print(f"   ✅ Connected! Found {len(tables_internal)} tables")
        
        SessionInternal = sessionmaker(bind=engine_internal)
        db_internal = SessionInternal()
        try:
            result = db_internal.execute(text("SELECT COUNT(*) FROM podcasts"))
            count_internal = result.scalar()
            print(f"   📻 Podcasts: {count_internal}")
        finally:
            db_internal.close()
except Exception as e:
    print(f"   ❌ Cannot connect (expected from outside Railway): {str(e)[:100]}")

# Try public connection
print("\n2️⃣  Public Connection (turntable.proxy.rlwy.net):")
try:
    engine_public = create_engine(PUBLIC_URL)
    with engine_public.connect() as conn:
        inspector = inspect(engine_public)
        tables_public = inspector.get_table_names()
        print(f"   ✅ Connected! Found {len(tables_public)} tables")
        
        SessionPublic = sessionmaker(bind=engine_public)
        db_public = SessionPublic()
        try:
            result = db_public.execute(text("SELECT COUNT(*) FROM podcasts"))
            count_public = result.scalar()
            print(f"   📻 Podcasts: {count_public}")
            
            # Check if tables match
            if set(tables_internal) == set(tables_public):
                print(f"   ✅ Same tables in both connections")
            else:
                print(f"   ⚠️  Different tables!")
                print(f"      Internal: {tables_internal}")
                print(f"      Public: {tables_public}")
        finally:
            db_public.close()
except Exception as e:
    print(f"   ❌ Error: {e}")

print("\n" + "=" * 70)
print("💡 Both connections should point to the SAME database")
print("   If counts differ, there might be a schema or connection issue")

