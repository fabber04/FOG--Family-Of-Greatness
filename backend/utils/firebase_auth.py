"""
Firebase Authentication Utilities
Handles Firebase ID token verification and user management
"""
import os
import requests
from typing import Optional, Dict
from fastapi import HTTPException, status
from dotenv import load_dotenv

load_dotenv()

# Firebase project configuration
FIREBASE_PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID")
FIREBASE_API_KEY = os.getenv("FIREBASE_API_KEY")

# Firebase REST API endpoint for token verification
FIREBASE_VERIFY_TOKEN_URL = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo"

def verify_firebase_token(token: str) -> Optional[Dict]:
    """
    Verify a Firebase ID token using Firebase REST API.
    Returns decoded token data if valid, None otherwise.
    """
    if not FIREBASE_PROJECT_ID or not FIREBASE_API_KEY:
        # If Firebase is not configured, return None (will fall back to JWT auth)
        return None
    
    try:
        # Use Firebase REST API to verify token
        verify_url = f"https://identitytoolkit.googleapis.com/v1/accounts:lookup?key={FIREBASE_API_KEY}"
        
        response = requests.post(
            verify_url,
            json={"idToken": token},
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("users") and len(data["users"]) > 0:
                user_info = data["users"][0]
                return {
                    "uid": user_info.get("localId") or user_info.get("uid"),
                    "email": user_info.get("email"),
                    "email_verified": user_info.get("emailVerified", False),
                    "display_name": user_info.get("displayName"),
                    "phone_number": user_info.get("phoneNumber"),
                }
        else:
            print(f"Firebase token verification failed: {response.status_code} - {response.text}")
        return None
    except Exception as e:
        print(f"Error verifying Firebase token: {e}")
        return None

def verify_firebase_token_admin_sdk(token: str) -> Optional[Dict]:
    """
    Verify Firebase token using Firebase Admin SDK (recommended for production).
    Requires FIREBASE_CREDENTIALS environment variable with path to service account JSON.
    """
    try:
        import firebase_admin
        from firebase_admin import credentials, auth
        
        # Initialize Firebase Admin if not already initialized
        if not firebase_admin._apps:
            cred_path = os.getenv("FIREBASE_CREDENTIALS")
            if cred_path and os.path.exists(cred_path):
                cred = credentials.Certificate(cred_path)
                firebase_admin.initialize_app(cred)
            else:
                # Try to use default credentials (for cloud environments)
                try:
                    firebase_admin.initialize_app()
                except Exception:
                    return None
        
        # Verify the token
        decoded_token = auth.verify_id_token(token)
        return {
            "uid": decoded_token.get("uid"),
            "email": decoded_token.get("email"),
            "email_verified": decoded_token.get("email_verified", False),
            "display_name": decoded_token.get("name"),
            "phone_number": decoded_token.get("phone_number"),
        }
    except Exception as e:
        print(f"Error verifying Firebase token with Admin SDK: {e}")
        return None

def get_firebase_user_info(token: str) -> Optional[Dict]:
    """
    Get Firebase user information from token.
    Tries Admin SDK first, falls back to REST API.
    """
    # Try Admin SDK first (more secure)
    user_info = verify_firebase_token_admin_sdk(token)
    if user_info:
        return user_info
    
    # Fall back to REST API
    return verify_firebase_token(token)

