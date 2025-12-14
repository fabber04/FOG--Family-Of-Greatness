#!/usr/bin/env python3
"""
Script to delete existing podcasts and re-upload them with original filenames.
"""

import os
import sys
import requests
from pathlib import Path

API_BASE_URL = "http://localhost:8000"

# Get auth token
def get_token():
    token = os.environ.get("AUTH_TOKEN")
    if not token:
        token_file = Path(".auth_token")
        if token_file.exists():
            with open(token_file, "r") as f:
                token = f.read().strip()
    if not token:
        print("❌ Error: AUTH_TOKEN is required!")
        print("   Run: python get_auth_token.py")
        sys.exit(1)
    return token

def delete_podcast(podcast_id, token):
    """Delete a podcast."""
    url = f"{API_BASE_URL}/api/podcasts/{podcast_id}"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.delete(url, headers=headers)
    return response.ok

def get_all_podcasts(token):
    """Get all podcasts."""
    url = f"{API_BASE_URL}/api/podcasts/"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    if response.ok:
        return response.json()
    return []

def main():
    token = get_token()
    
    print("🗑️  Step 1: Deleting existing podcasts...")
    podcasts = get_all_podcasts(token)
    print(f"   Found {len(podcasts)} podcasts to delete")
    
    deleted = 0
    for podcast in podcasts:
        podcast_id = podcast.get("id")
        if podcast_id:
            if delete_podcast(podcast_id, token):
                deleted += 1
                print(f"   ✅ Deleted podcast ID {podcast_id}: {podcast.get('title', 'Unknown')}")
            else:
                print(f"   ❌ Failed to delete podcast ID {podcast_id}")
    
    print(f"\n✨ Deleted {deleted} podcasts")
    print("\n📤 Step 2: Re-uploading with original filenames...")
    print("   (This will use the upload_podcasts.py script)")
    print()
    
    # Now run the upload script
    os.system(f"python upload_podcasts.py {token}")

if __name__ == "__main__":
    main()

