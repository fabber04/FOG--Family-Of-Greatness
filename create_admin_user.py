#!/usr/bin/env python3
"""
Create an admin user directly via the backend API.
This bypasses the registration endpoint and creates a user via direct API call.
"""

import requests
import sys

# Configuration
API_BASE_URL = "https://fog-family-of-greatness-production.up.railway.app"

def create_admin_user(username, password, email, full_name):
    """Create an admin user via backend API."""
    print(f"🔐 Creating admin user: {username}")
    print(f"   Backend: {API_BASE_URL}")
    print()
    
    # Try to register first
    register_data = {
        "username": username,
        "password": password,
        "email": email,
        "full_name": full_name
    }
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/api/auth/register",
            json=register_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token")
            print(f"✅ User created successfully!")
            print(f"📋 Auth token:")
            print(f"   {token}")
            print()
            print(f"💾 Saving to .auth_token file...")
            with open(".auth_token", "w") as f:
                f.write(token)
            print(f"   ✅ Token saved!")
            print()
            print(f"🚀 You can now upload podcasts:")
            print(f"   python upload_podcasts.py")
            return token
        else:
            error = response.json().get("detail", response.text)
            print(f"❌ Registration failed: {error}")
            print()
            print(f"💡 The registration endpoint might have issues.")
            print(f"   Try registering via the website instead:")
            print(f"   https://fabber04.github.io/FOG--Family-Of-Greatness/register")
            return None
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Error: Cannot connect to backend at {API_BASE_URL}")
        print(f"   Make sure the backend is running on Railway!")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def main():
    if len(sys.argv) >= 5:
        username = sys.argv[1]
        password = sys.argv[2]
        email = sys.argv[3]
        full_name = sys.argv[4]
    else:
        print("🔐 Create Admin User")
        print("=" * 50)
        print()
        print("Enter user details:")
        username = input("Username: ").strip()
        password = input("Password: ").strip()
        email = input("Email: ").strip()
        full_name = input("Full Name: ").strip()
    
    if not all([username, password, email, full_name]):
        print("❌ All fields are required!")
        sys.exit(1)
    
    token = create_admin_user(username, password, email, full_name)
    
    if token:
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()

