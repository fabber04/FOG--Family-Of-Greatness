#!/usr/bin/env python3
"""
Manual podcast upload script - upload podcasts one by one interactively
"""

import os
import sys
import requests
from pathlib import Path

API_BASE_URL = "https://fog-family-of-greatness-production.up.railway.app"

def upload_file(file_path, endpoint, file_type="audio"):
    """Upload a file to the backend."""
    url = f"{API_BASE_URL}/api/podcasts/{endpoint}"
    
    mime_types = {
        "audio": "audio/m4a",
        "image": "image/jpeg"
    }
    
    print(f"  📤 Uploading {file_type} file: {os.path.basename(file_path)}...")
    
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
    print(f"  ✅ {file_type.capitalize()} uploaded: {result.get('url', 'success')}")
    return result

def create_podcast_entry(podcast_data):
    """Create podcast entry in database."""
    url = f"{API_BASE_URL}/api/podcasts/"
    headers = {"Content-Type": "application/json"}
    
    print(f"  📝 Creating podcast entry: {podcast_data['title']}...")
    response = requests.post(url, headers=headers, json=podcast_data)
    
    if not response.ok:
        try:
            error = response.json().get("detail", response.text)
        except:
            error = response.text
        raise Exception(f"Failed to create podcast: {error}")
    
    result = response.json()
    print(f"  ✅ Podcast created with ID: {result.get('id')}")
    return result

def upload_single_podcast():
    """Upload a single podcast interactively."""
    print("\n" + "="*60)
    print("📻 Manual Podcast Upload")
    print("="*60)
    
    # Get audio file
    audio_path = input("\n📁 Enter path to audio file (or press Enter to skip): ").strip()
    if not audio_path:
        print("⚠️  Skipping audio upload")
        audio_url = None
    else:
        audio_path = Path(audio_path)
        if not audio_path.exists():
            print(f"❌ File not found: {audio_path}")
            return False
        audio_result = upload_file(audio_path, "upload-audio", "audio")
        audio_url = audio_result.get("url")
    
    # Get cover image
    cover_path = input("\n🖼️  Enter path to cover image (or press Enter to skip): ").strip()
    if not cover_path:
        print("⚠️  Skipping cover upload")
        cover_url = None
    else:
        cover_path = Path(cover_path)
        if not cover_path.exists():
            print(f"❌ File not found: {cover_path}")
            return False
        cover_result = upload_file(cover_path, "upload-cover", "image")
        cover_url = cover_result.get("url")
    
    # Get podcast metadata
    print("\n📝 Enter podcast details:")
    title = input("   Title: ").strip()
    if not title:
        print("❌ Title is required!")
        return False
    
    host = input("   Host: ").strip() or "FOG Relationship Team"
    category = input("   Category (default: beyond-dating-game): ").strip() or "beyond-dating-game"
    description = input("   Description: ").strip() or "Podcast episode"
    tags = input("   Tags (comma-separated): ").strip()
    
    # Create podcast entry
    podcast_data = {
        "title": title,
        "host": host,
        "type": "episode",
        "category": category,
        "description": description,
        "audio_url": audio_url,
        "cover": cover_url,
        "tags": tags if tags else None,
        "duration": None,
        "is_live": False,
        "is_free": True
    }
    
    try:
        create_podcast_entry(podcast_data)
        print("\n✅ Podcast uploaded successfully!")
        return True
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return False

def main():
    """Main function."""
    print("🚀 Manual Podcast Upload Tool")
    print("Upload podcasts one by one to Railway backend\n")
    
    while True:
        success = upload_single_podcast()
        
        if success:
            continue_choice = input("\n📤 Upload another podcast? (y/n): ").strip().lower()
            if continue_choice != 'y':
                break
        else:
            retry = input("\n🔄 Retry? (y/n): ").strip().lower()
            if retry != 'y':
                break
    
    print("\n✨ Done!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted by user")
        sys.exit(0)

