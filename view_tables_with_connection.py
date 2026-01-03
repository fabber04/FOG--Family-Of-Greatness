#!/usr/bin/env python3
"""
View all tables in Railway PostgreSQL using the public connection string
"""

import sys
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker

# Public Railway PostgreSQL connection string
DATABASE_URL = "postgresql://postgres:uJfgOyLyqoeBVIxRbpFklOBtbAwLiMgK@turntable.proxy.rlwy.net:49383/railway"

print("🔗 Connecting to Railway PostgreSQL database...")
print("=" * 70)

try:
    # Create engine
    engine = create_engine(DATABASE_URL)
    
    # Test connection
    with engine.connect() as conn:
        print("✅ Connected successfully!\n")
    
    # Get inspector
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    print(f"📊 Found {len(tables)} tables:\n")
    
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    try:
        for table in sorted(tables):
            print("=" * 70)
            print(f"📋 TABLE: {table.upper()}")
            print("=" * 70)
            
            # Get column info
            columns = inspector.get_columns(table)
            column_names = [col['name'] for col in columns]
            
            print(f"Columns ({len(column_names)}): {', '.join(column_names[:5])}")
            if len(column_names) > 5:
                print(f"            ... and {len(column_names) - 5} more")
            
            # Get row count
            result = db.execute(text(f"SELECT COUNT(*) FROM {table}"))
            count = result.scalar()
            print(f"Total Rows: {count}\n")
            
            if count > 0:
                # Get sample data (first 5 rows)
                limit = min(5, count)
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
                        elif isinstance(value, str) and len(value) > 60:
                            display_value = value[:57] + "..."
                        else:
                            display_value = str(value)
                        print(f"   {col_name}: {display_value}")
                
                if count > limit:
                    print(f"\n... and {count - limit} more rows")
            else:
                print("(No data in this table)")
            
            print()
        
        # Summary
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
    print("\n💡 Tip: These tables are now visible in your Railway PostgreSQL database!")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

