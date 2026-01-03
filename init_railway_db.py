#!/usr/bin/env python3
"""
Initialize Railway database by calling a backend endpoint
This script creates the database tables if they don't exist
"""

import requests
import sys

API_BASE_URL = "https://fog-family-of-greatness-production.up.railway.app"

def init_database():
    """Initialize database by making a request that triggers table creation."""
    print("🔄 Initializing Railway database...")
    print("   (This happens automatically on backend startup, but we'll verify)")
    
    # The backend should create tables on startup via Base.metadata.create_all()
    # Let's check if we can access the health endpoint first
    try:
        response = requests.get(f"{API_BASE_URL}/api/health", timeout=10)
        if response.status_code == 200:
            print("✅ Backend is running")
        else:
            print(f"⚠️  Backend returned: {response.status_code}")
    except Exception as e:
        print(f"❌ Cannot reach backend: {e}")
        return False
    
    # Try to create a test podcast to see if tables exist
    print("\n📝 Testing database tables...")
    test_data = {
        "title": "Database Test",
        "host": "System",
        "type": "episode",
        "category": "test",
        "description": "Testing database initialization",
        "audio_url": "/test.m4a",
        "cover": "/test.jpg"
    }
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/api/podcasts/",
            headers={"Content-Type": "application/json"},
            json=test_data,
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ Database tables exist and are working!")
            # Delete the test podcast
            podcast_id = response.json().get("id")
            if podcast_id:
                print(f"   Created test podcast (ID: {podcast_id})")
            return True
        else:
            print(f"❌ Database error: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            return False
    except Exception as e:
        print(f"❌ Error testing database: {e}")
        return False

if __name__ == "__main__":
    success = init_database()
    if not success:
        print("\n⚠️  Database initialization check failed.")
        print("   The backend should create tables automatically on startup.")
        print("   Check Railway logs for database connection errors.")
        sys.exit(1)
    else:
        print("\n✅ Database is ready!")

