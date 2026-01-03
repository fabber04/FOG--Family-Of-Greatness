#!/usr/bin/env python3
"""
Helper script to get an authentication token from the Railway backend.
This token can be used with upload scripts.
"""

import os
import sys
import requests
import json

# Configuration
API_BASE_URL = os.environ.get("API_BASE_URL", "https://fog-family-of-greatness-production.up.railway.app")

def login(username, password):
    """Login and get auth token."""
    url = f"{API_BASE_URL}/api/auth/login"
    
    try:
        response = requests.post(
            url,
            json={"username": username, "password": password},
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            return data.get("access_token")
        else:
            error = response.json().get("detail", response.text)
            print(f"❌ Login failed: {error}")
            return None
    except requests.exceptions.ConnectionError:
        print(f"❌ Error: Cannot connect to server at {API_BASE_URL}")
        print(f"   Make sure the backend is running on Railway!")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def main():
    print("🔐 FOG Authentication Token Getter")
    print("=" * 50)
    print(f"Backend: {API_BASE_URL}")
    print()
    
    # Check if credentials provided
    if len(sys.argv) >= 3:
        username = sys.argv[1]
        password = sys.argv[2]
    else:
        print("Enter your credentials:")
        username = input("Username: ").strip()
        password = input("Password: ").strip()
    
    if not username or not password:
        print("❌ Username and password are required!")
        sys.exit(1)
    
    print(f"\n🔑 Logging in as {username}...")
    token = login(username, password)
    
    if token:
        print(f"\n✅ Login successful!")
        print(f"\n📋 Your auth token:")
        print(f"   {token}")
        print(f"\n💡 To use this token:")
        print(f"   export AUTH_TOKEN='{token}'")
        print(f"\n   Or run upload scripts with:")
        print(f"   python upload_podcasts.py {token}")
        print(f"\n💾 Saving to .auth_token file...")
        
        # Save to file
        with open(".auth_token", "w") as f:
            f.write(token)
        print(f"   ✅ Token saved to .auth_token")
        print(f"   (Upload scripts will automatically use this file)")
    else:
        print("\n❌ Failed to get token!")
        print("\n💡 Make sure:")
        print("   1. The backend is running on Railway")
        print("   2. You have a user account (register first if needed)")
        print("   3. Your credentials are correct")
        sys.exit(1)

if __name__ == "__main__":
    main()
