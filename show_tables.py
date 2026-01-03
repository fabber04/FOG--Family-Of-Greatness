#!/usr/bin/env python3
"""
Display all Railway database tables using the API
"""

import requests
import json

API_URL = "https://fog-family-of-greatness-production.up.railway.app"

print("🔍 Fetching database tables from Railway...")
print("=" * 70)

try:
    # Try the new view-tables endpoint first
    response = requests.get(f"{API_URL}/api/view-tables", timeout=10)
    
    if response.status_code == 200:
        data = response.json()
        
        if data.get("status") == "success":
            tables_info = data.get("tables", {})
            
            print(f"\n✅ Found {data.get('total_tables', 0)} tables\n")
            
            for table_name, table_info in sorted(tables_info.items()):
                print("=" * 70)
                print(f"📋 TABLE: {table_name.upper()}")
                print("=" * 70)
                print(f"Columns: {', '.join(table_info.get('columns', []))}")
                print(f"Total Rows: {table_info.get('row_count', 0)}")
                print(f"Showing: {table_info.get('showing', 0)} sample rows\n")
                
                sample_data = table_info.get('sample_data', [])
                if sample_data:
                    print("Sample Data:")
                    print("-" * 70)
                    for i, row in enumerate(sample_data, 1):
                        print(f"\n[{i}]")
                        for col, value in row.items():
                            if value is None:
                                display = "NULL"
                            elif isinstance(value, str) and len(value) > 60:
                                display = value[:57] + "..."
                            else:
                                display = str(value)
                            print(f"   {col}: {display}")
                    
                    if table_info.get('row_count', 0) > len(sample_data):
                        remaining = table_info.get('row_count', 0) - len(sample_data)
                        print(f"\n... and {remaining} more rows")
                else:
                    print("(No data in this table)")
                print()
            
            # Summary
            print("=" * 70)
            print("📊 SUMMARY")
            print("=" * 70)
            for table_name, table_info in sorted(tables_info.items()):
                count = table_info.get('row_count', 0)
                print(f"  {table_name:30} {count:>5} rows")
            
        else:
            print(f"❌ Error: {data.get('message')}")
    elif response.status_code == 404:
        # Fallback to test-db endpoint
        print("⚠️  Using fallback method...\n")
        response = requests.get(f"{API_URL}/api/test-db", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Database Status: {data.get('status')}")
            print(f"✅ Tables Found: {len(data.get('tables', []))}")
            print(f"✅ Podcasts: {data.get('podcasts_count', 0)}")
            print("\n📋 Tables:")
            for table in sorted(data.get('tables', [])):
                print(f"   • {table}")
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
    else:
        print(f"❌ Error: {response.status_code} - {response.text}")
        
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()

print("\n✅ Done!")

