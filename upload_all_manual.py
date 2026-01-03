#!/usr/bin/env python3
"""
Upload all podcasts manually, one by one
This script uploads each episode sequentially with progress tracking
"""

import sys
from upload_one import upload_episode, PODCAST_METADATA

def main():
    """Upload all episodes."""
    total = len(PODCAST_METADATA)
    success_count = 0
    error_count = 0
    
    print(f"🚀 Starting manual upload of {total} episodes...\n")
    
    for i in range(1, total + 1):
        print(f"\n{'='*60}")
        print(f"Episode {i}/{total}")
        print(f"{'='*60}")
        
        success = upload_episode(i)
        
        if success:
            success_count += 1
            print(f"✅ Episode {i} uploaded successfully!")
        else:
            error_count += 1
            print(f"❌ Episode {i} failed!")
        
        # Small delay between uploads
        import time
        time.sleep(1)
    
    print(f"\n{'='*60}")
    print("✨ Upload Complete!")
    print(f"   ✅ Success: {success_count}/{total}")
    print(f"   ❌ Errors: {error_count}/{total}")
    print(f"{'='*60}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Upload interrupted by user")
        sys.exit(1)

