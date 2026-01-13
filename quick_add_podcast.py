#!/usr/bin/env python3
"""
Quick script to add a single podcast to the database.
Usage: python3 quick_add_podcast.py <audio_file> <cover_image> <title> <category>
"""

import os
import sys
import requests
from pathlib import Path

# Configuration
API_BASE_URL = os.environ.get("API_BASE_URL", "https://fog-backend-iyhz.onrender.com")

def upload_file(file_path, endpoint, file_type="audio"):
    """Upload a file to the backend."""
    url = f"{API_BASE_URL}/api/podcasts/{endpoint}"
    
    mime_types = {
        "audio": "audio/m4a",
        "image": "image/jpeg"
    }
    
    print(f"📤 Uploading {file_type}: {os.path.basename(file_path)}...")
    
    with open(file_path, "rb") as f:
        files = {"file": (os.path.basename(file_path), f, mime_types.get(file_type, "application/octet-stream"))}
        response = requests.post(url, files=files)
    
    if not response.ok:
        try:
            error = response.json().get("detail", response.text)
        except:
            error = response.text
        raise Exception(f"Failed to upload {file_type}: {error}")
    
    result = response.json()
    print(f"✅ {file_type.capitalize()} uploaded: {result.get('url', 'success')}")
    return result

def create_podcast(podcast_data):
    """Create podcast entry in database."""
    url = f"{API_BASE_URL}/api/podcasts/"
    headers = {"Content-Type": "application/json"}
    
    print("📝 Creating podcast entry...")
    response = requests.post(url, headers=headers, json=podcast_data)
    
    if not response.ok:
        try:
            error = response.json().get("detail", response.text)
        except:
            error = response.text
        raise Exception(f"Failed to create podcast: {error}")
    
    result = response.json()
    print(f"✅ Podcast created with ID: {result.get('id', 'success')}")
    return result

def main():
    if len(sys.argv) < 5:
        print("Usage: python3 quick_add_podcast.py <audio_file> <cover_image> <title> <category>")
        print("\nExample:")
        print('  python3 quick_add_podcast.py "Episode 01.m4a" "cover.jpeg" "Episode 01: Title" "beyond-dating-game"')
        print("\nCategories:")
        print("  - spiritual-development")
        print("  - relationships")
        print("  - personal-development")
        print("  - wisdom-keys")
        print("  - beyond-dating-game")
        print("  - wisdom-for-ladies")
        print("  - teens")
        print("  - university-students")
        sys.exit(1)
    
    audio_file = Path(sys.argv[1])
    cover_image = Path(sys.argv[2])
    title = sys.argv[3]
    category = sys.argv[4]
    
    # Validate files exist
    if not audio_file.exists():
        print(f"❌ Audio file not found: {audio_file}")
        sys.exit(1)
    
    if not cover_image.exists():
        print(f"❌ Cover image not found: {cover_image}")
        sys.exit(1)
    
    try:
        # Upload files
        audio_result = upload_file(audio_file, "upload-audio", "audio")
        cover_result = upload_file(cover_image, "upload-cover", "image")
        
        # Create podcast entry
        podcast_data = {
            "title": title,
            "host": "FOG Relationship Team",
            "type": "episode",
            "category": category,
            "description": f"Podcast episode: {title}",
            "audio_url": audio_result["url"],
            "cover": cover_result["url"],
            "tags": "podcast, fog",
            "is_free": True,
            "is_live": False
        }
        
        podcast = create_podcast(podcast_data)
        
        print(f"\n✨ Success! Podcast added to database:")
        print(f"   ID: {podcast.get('id')}")
        print(f"   Title: {podcast.get('title')}")
        print(f"   URL: {API_BASE_URL}/api/podcasts/{podcast.get('id')}")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

