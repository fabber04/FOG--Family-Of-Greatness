#!/usr/bin/env python3
"""
View all tables and data from Railway PostgreSQL database
"""

import os
import sys

# Get DATABASE_URL from Railway
# You can get this from: Railway → PostgreSQL → Variables → DATABASE_URL
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("❌ DATABASE_URL not set!")
    print("\n📋 To get your Railway DATABASE_URL:")
    print("1. Go to Railway dashboard")
    print("2. Click on your PostgreSQL service")
    print("3. Go to 'Variables' tab")
    print("4. Copy the DATABASE_URL value")
    print("\nThen run:")
    print("  export DATABASE_URL='postgresql://...'")
    print("  python view_railway_tables.py")
    print("\nOr use the internal URL you shared earlier:")
    print("  export DATABASE_URL='postgresql://postgres:uJfgOyLyqoeBVIxRbpFklOBtbAwLiMgK@postgres.railway.internal:5432/railway'")
    print("  python view_railway_tables.py")
    sys.exit(1)

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker

# Create engine
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

print("🔗 Connecting to Railway PostgreSQL database...")
print("=" * 70)

try:
    # Get inspector
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    print(f"\n✅ Connected! Found {len(tables)} tables\n")
    
    db = SessionLocal()
    try:
        for table in sorted(tables):
            print("=" * 70)
            print(f"📋 TABLE: {table.upper()}")
            print("=" * 70)
            
            # Get column info
            columns = inspector.get_columns(table)
            column_names = [col['name'] for col in columns]
            
            print(f"Columns: {', '.join(column_names)}")
            
            # Get row count
            result = db.execute(text(f"SELECT COUNT(*) FROM {table}"))
            count = result.scalar()
            print(f"Total Rows: {count}\n")
            
            if count > 0:
                # Get sample data (limit to 10 rows for display)
                limit = min(10, count)
                result = db.execute(text(f"SELECT * FROM {table} LIMIT {limit}"))
                rows = result.fetchall()
                
                print("Sample Data:")
                print("-" * 70)
                
                for i, row in enumerate(rows, 1):
                    print(f"\n[{i}]")
                    for col_name, value in zip(column_names, row):
                        # Truncate long values
                        if value is None:
                            display_value = "NULL"
                        elif isinstance(value, str) and len(value) > 50:
                            display_value = value[:47] + "..."
                        else:
                            display_value = str(value)
                        print(f"   {col_name}: {display_value}")
                
                if count > limit:
                    print(f"\n... and {count - limit} more rows")
            else:
                print("(No data in this table)")
            
            print()
        
        # Show summary
        print("=" * 70)
        print("📊 SUMMARY")
        print("=" * 70)
        for table in sorted(tables):
            result = db.execute(text(f"SELECT COUNT(*) FROM {table}"))
            count = result.scalar()
            print(f"  {table:30} {count:>5} rows")
        
    finally:
        db.close()
    
    print("\n✅ Database view complete!")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

