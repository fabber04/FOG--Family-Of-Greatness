#!/usr/bin/env python3
"""
Test script to upload files to the FOG server.
Supports uploading podcasts (audio and covers), events, courses, and library items.
"""

import os
import sys
import requests
from pathlib import Path

# Use Railway URL for production, or set via environment variable
API_BASE_URL = os.environ.get("API_BASE_URL", "https://fog-family-of-greatness-production.up.railway.app")

# Get token from environment, file, or command line
def get_token():
    """Get authentication token from various sources."""
    # 1. Check environment variable
    token = os.environ.get("AUTH_TOKEN")
    if token:
        return token
    
    # 2. Check .auth_token file
    token_file = Path(".auth_token")
    if token_file.exists():
        with open(token_file, "r") as f:
            token = f.read().strip()
            if token:
                return token
    
    # 3. Check command line argument
    if len(sys.argv) > 1:
        return sys.argv[1]
    
    return None


def upload_file(file_path, endpoint, token, description="file"):
    """Upload a file to the server."""
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        return None
    
    print(f"📤 Uploading {description}...")
    print(f"   File: {file_path}")
    
    url = f"{API_BASE_URL}{endpoint}"
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        with open(file_path, "rb") as f:
            files = {"file": (os.path.basename(file_path), f)}
            response = requests.post(url, headers=headers, files=files)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Upload successful!")
            print(f"   Original filename: {result.get('filename', 'N/A')}")
            print(f"   Server URL: {result.get('url', 'N/A')}")
            print(f"   Full URL: {API_BASE_URL}{result.get('url', '')}")
            return result
        else:
            error = response.json().get("detail", response.text)
            print(f"❌ Upload failed: {error}")
            return None
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Error: Cannot connect to server at {API_BASE_URL}")
        print(f"   Make sure the server is running!")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


def main():
    """Main function to test file uploads."""
    token = get_token()
    
    if not token:
        print("❌ Error: AUTH_TOKEN is required!")
        print("\n💡 To get a token:")
        print("   1. Run: python get_auth_token.py")
        print("   2. Or set: export AUTH_TOKEN='your_token_here'")
        print("   3. Or pass as argument: python test_upload.py your_token_here")
        print("\n💡 Default credentials:")
        print("   Admin: username='admin', password='admin123'")
        sys.exit(1)
    
    print("🚀 FOG File Upload Test")
    print("=" * 50)
    print(f"Server: {API_BASE_URL}")
    print(f"Token: {token[:30]}...")
    print()
    
    # Map upload types to endpoints
    endpoint_map = {
        "podcast-audio": "/api/podcasts/upload-audio",
        "podcast-cover": "/api/podcasts/upload-cover",
        "event-image": "/api/events/upload-image",
        "course-cover": "/api/courses/upload-cover",
        "library-cover": "/api/library/upload-cover",
    }
    
    # Check if file path provided
    # Note: get_token() may have consumed sys.argv[1] if it was a token
    # So we need to check if sys.argv[1] looks like a file path or token
    file_path = None
    upload_type = None
    
    if len(sys.argv) >= 2:
        # Check if sys.argv[1] looks like a file path (has / or .) or is a token
        arg1 = sys.argv[1]
        # If it looks like a file path (contains / or starts with . or has file extension)
        if '/' in arg1 or arg1.startswith('.') or '.' in arg1.split('/')[-1]:
            file_path = arg1
            # Check if there's a type argument
            if len(sys.argv) >= 3:
                upload_type = sys.argv[2]
        # Otherwise, it might be a token, so file_path is in sys.argv[2]
        elif len(sys.argv) >= 3:
            file_path = sys.argv[2]
            if len(sys.argv) >= 4:
                upload_type = sys.argv[3]
    
    if file_path:
        # If upload_type not provided, auto-detect from extension
        if not upload_type:
            ext = Path(file_path).suffix.lower()
            if ext in [".mp3", ".m4a", ".wav", ".ogg", ".aac", ".mp4"]:
                upload_type = "podcast-audio"
            else:
                upload_type = "podcast-cover"
        
        # Map upload type to endpoint
        if upload_type in endpoint_map:
            endpoint = endpoint_map[upload_type]
        else:
            print(f"❌ Unknown upload type: {upload_type}")
            print(f"   Valid types: {', '.join(endpoint_map.keys())}")
            sys.exit(1)
    else:
        # Interactive mode
        print("📝 Usage Examples:")
        print()
        print("Upload podcast audio:")
        print("  python test_upload.py [token] /path/to/audio.m4a podcast-audio")
        print()
        print("Upload podcast cover:")
        print("  python test_upload.py [token] /path/to/cover.jpg podcast-cover")
        print()
        print("Upload event image:")
        print("  python test_upload.py [token] /path/to/image.jpg event-image")
        print()
        print("Upload course cover:")
        print("  python test_upload.py [token] /path/to/cover.jpg course-cover")
        print()
        print("Upload library cover:")
        print("  python test_upload.py [token] /path/to/cover.jpg library-cover")
        print()
        print("💡 If token is in .auth_token or AUTH_TOKEN env var, you can omit it:")
        print("  python test_upload.py /path/to/file.jpg podcast-cover")
        print()
        
        # Interactive mode
        file_path = input("Enter file path to upload: ").strip()
        if not file_path:
            print("❌ No file path provided")
            sys.exit(1)
        
        print("\nSelect upload type:")
        print("  1. Podcast Audio")
        print("  2. Podcast Cover")
        print("  3. Event Image")
        print("  4. Course Cover")
        print("  5. Library Cover")
        choice = input("Choice (1-5): ").strip()
        
        upload_types = {
            "1": ("podcast-audio", "/api/podcasts/upload-audio"),
            "2": ("podcast-cover", "/api/podcasts/upload-cover"),
            "3": ("event-image", "/api/events/upload-image"),
            "4": ("course-cover", "/api/courses/upload-cover"),
            "5": ("library-cover", "/api/library/upload-cover"),
        }
        
        if choice not in upload_types:
            print("❌ Invalid choice")
            sys.exit(1)
        
        upload_type, endpoint = upload_types[choice]
    
    # Upload the file
    result = upload_file(file_path, endpoint, token, upload_type.replace("-", " "))
    
    if result:
        print("\n✨ Upload completed successfully!")
        print(f"\n📋 Summary:")
        print(f"   File: {file_path}")
        print(f"   Type: {upload_type}")
        print(f"   URL: {API_BASE_URL}{result.get('url', '')}")
        sys.exit(0)
    else:
        print("\n❌ Upload failed!")
        sys.exit(1)


if __name__ == "__main__":
    main()

