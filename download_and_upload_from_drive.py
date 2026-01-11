#!/usr/bin/env python3
"""
Script to download podcasts from Google Drive folder and upload them to the backend.
Usage: python download_and_upload_from_drive.py <GOOGLE_DRIVE_FOLDER_ID>
"""

import os
import sys
import requests
from pathlib import Path
import zipfile
import tempfile
import shutil

# Configuration
API_BASE_URL = os.environ.get("API_BASE_URL", "https://fog-backend-iyhz.onrender.com")
AUTH_TOKEN = os.environ.get("AUTH_TOKEN", "")

# Google Drive folder ID from the URL
# URL format: https://drive.google.com/drive/folders/1WzmdDfCQt-hV9eF0LopaQH9TNs2I6EiA
GOOGLE_DRIVE_FOLDER_ID = sys.argv[1] if len(sys.argv) > 1 else "1WzmdDfCQt-hV9eF0LopaQH9TNs2I6EiA"

# Temporary directory for downloads
TEMP_DIR = Path(tempfile.mkdtemp())
DOWNLOAD_DIR = TEMP_DIR / "downloads"

def download_google_drive_folder(folder_id):
    """
    Download a Google Drive folder as a ZIP file.
    Note: This requires the folder to be publicly accessible or shared.
    """
    print(f"📥 Downloading Google Drive folder: {folder_id}")
    
    # Google Drive direct download URL for folders (as ZIP)
    # This works if the folder is shared publicly
    zip_url = f"https://drive.google.com/uc?export=download&id={folder_id}"
    
    try:
        # Create download directory
        DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)
        
        # Download the ZIP file
        print("  Downloading ZIP file...")
        response = requests.get(zip_url, stream=True, allow_redirects=True)
        
        # Check if we got redirected to a confirmation page
        if "virus scan warning" in response.text.lower() or "download" in response.url.lower():
            # Try to extract the actual download link
            # For now, we'll use a different approach
            print("  ⚠️  Direct download not available. Please download manually:")
            print(f"     https://drive.google.com/drive/folders/{folder_id}")
            print("\n  After downloading:")
            print("  1. Extract the ZIP file")
            print("  2. Update PODCASTS_FOLDER path in upload_podcasts.py")
            print("  3. Run: python upload_podcasts.py")
            return None
        
        # Save the ZIP file
        zip_path = DOWNLOAD_DIR / f"{folder_id}.zip"
        with open(zip_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"  ✅ Downloaded: {zip_path}")
        
        # Extract ZIP file
        print("  📦 Extracting ZIP file...")
        extract_dir = DOWNLOAD_DIR / "extracted"
        extract_dir.mkdir(exist_ok=True)
        
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)
        
        print(f"  ✅ Extracted to: {extract_dir}")
        return extract_dir
        
    except Exception as e:
        print(f"  ❌ Error downloading: {e}")
        print("\n  💡 Alternative: Download manually from Google Drive")
        print(f"     https://drive.google.com/drive/folders/{folder_id}")
        return None


def upload_audio_file(file_path, token):
    """Upload audio file to backend."""
    url = f"{API_BASE_URL}/api/podcasts/upload-audio"
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    with open(file_path, "rb") as f:
        files = {"file": (os.path.basename(file_path), f, "audio/m4a")}
        response = requests.post(url, headers=headers, files=files)
    
    if not response.ok:
        error = response.json().get("detail", response.text)
        raise Exception(f"Failed to upload audio: {error}")
    
    return response.json()


def upload_cover_image(image_path, token):
    """Upload cover image to backend."""
    url = f"{API_BASE_URL}/api/podcasts/upload-cover"
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    with open(image_path, "rb") as f:
        files = {"file": (os.path.basename(image_path), f, "image/jpeg")}
        response = requests.post(url, headers=headers, files=files)
    
    if not response.ok:
        error = response.json().get("detail", response.text)
        raise Exception(f"Failed to upload cover: {error}")
    
    return response.json()


def create_podcast(podcast_data, token):
    """Create podcast entry in backend."""
    url = f"{API_BASE_URL}/api/podcasts/"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    response = requests.post(url, headers=headers, json=podcast_data)
    
    if not response.ok:
        try:
            error = response.json().get("detail", response.text)
        except:
            error = response.text or f"HTTP {response.status_code}"
        raise Exception(f"Failed to create podcast: {error}")
    
    try:
        return response.json()
    except:
        raise Exception(f"Invalid JSON response: {response.text}")


def find_audio_files(directory):
    """Find all audio files in directory and subdirectories."""
    audio_extensions = {'.m4a', '.mp3', '.wav', '.ogg', '.aac', '.mp4'}
    audio_files = []
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if Path(file).suffix.lower() in audio_extensions:
                audio_files.append(Path(root) / file)
    
    return audio_files


def find_image_files(directory):
    """Find all image files in directory and subdirectories."""
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
    image_files = []
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if Path(file).suffix.lower() in image_extensions:
                image_files.append(Path(root) / file)
    
    return image_files


def main():
    print("🚀 Google Drive Podcast Uploader\n")
    
    # Download from Google Drive
    extracted_dir = download_google_drive_folder(GOOGLE_DRIVE_FOLDER_ID)
    
    if not extracted_dir:
        print("\n❌ Could not download from Google Drive automatically.")
        print("   Please download manually and update the script.")
        return
    
    # Find audio files
    audio_files = find_audio_files(extracted_dir)
    image_files = find_image_files(extracted_dir)
    
    print(f"\n📊 Found:")
    print(f"   Audio files: {len(audio_files)}")
    print(f"   Image files: {len(image_files)}")
    
    if not audio_files:
        print("\n❌ No audio files found in downloaded folder.")
        return
    
    # Get cover images from local public/images/podcasts folder as fallback
    local_images_dir = Path(__file__).parent / "public" / "images" / "podcasts"
    local_images = list(local_images_dir.glob("*.jpeg")) + list(local_images_dir.glob("*.jpg")) if local_images_dir.exists() else []
    
    print(f"\n🔄 Starting upload process...\n")
    
    success_count = 0
    error_count = 0
    
    for i, audio_file in enumerate(audio_files, 1):
        try:
            print(f"\n[{i}/{len(audio_files)}] Processing: {audio_file.name}")
            
            # Upload audio
            print("  📤 Uploading audio file...")
            audio_result = upload_audio_file(audio_file, AUTH_TOKEN)
            print(f"  ✅ Audio uploaded: {audio_result['url']}")
            
            # Find matching cover image
            cover_image = None
            # Try to find image with similar name
            audio_name = audio_file.stem.lower()
            for img in image_files:
                if audio_name in img.stem.lower() or img.stem.lower() in audio_name:
                    cover_image = img
                    break
            
            # If no match found, use first available image or local image
            if not cover_image:
                if image_files:
                    cover_image = image_files[0]
                elif local_images:
                    cover_image = local_images[0]
            
            # Upload cover
            if cover_image:
                print(f"  📤 Uploading cover image: {cover_image.name}...")
                cover_result = upload_cover_image(cover_image, AUTH_TOKEN)
                print(f"  ✅ Cover uploaded: {cover_result['url']}")
            else:
                print("  ⚠️  No cover image found, using default")
                cover_result = {"url": "/images/podcasts/Wisdom keys.jpeg"}
            
            # Create podcast entry
            print("  📝 Creating podcast entry...")
            podcast_data = {
                "title": audio_file.stem,  # Use filename as title
                "host": "FOG Team",
                "type": "episode",
                "category": "spiritual-development",  # Default category
                "description": f"Podcast episode: {audio_file.stem}",
                "duration": None,
                "is_live": False,
                "is_free": True,
                "tags": "podcast, episode",
                "audio_url": audio_result["url"],
                "transcript": None,
                "cover": cover_result["url"]
            }
            
            podcast = create_podcast(podcast_data, AUTH_TOKEN)
            print(f"  ✅ Podcast created with ID: {podcast['id']}")
            success_count += 1
            
        except Exception as error:
            print(f"  ❌ Error: {str(error)}")
            error_count += 1
    
    # Cleanup
    print(f"\n🧹 Cleaning up temporary files...")
    shutil.rmtree(TEMP_DIR, ignore_errors=True)
    
    print(f"\n✨ Upload process completed!")
    print(f"   ✅ Success: {success_count}")
    print(f"   ❌ Errors: {error_count}")


if __name__ == "__main__":
    main()

