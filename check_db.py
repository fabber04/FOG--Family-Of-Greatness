#!/usr/bin/env python3
"""
Quick script to check if database tables exist on Railway
"""

import requests
import json

API_BASE_URL = "https://fog-family-of-greatness-production.up.railway.app"

# Test if API is accessible
print("Testing API connection...")
try:
    response = requests.get(f"{API_BASE_URL}/api/health")
    print(f"✅ Health check: {response.status_code} - {response.json()}")
except Exception as e:
    print(f"❌ Health check failed: {e}")

# Test creating a podcast with detailed error
print("\nTesting podcast creation...")
test_data = {
    "title": "Test Podcast",
    "host": "Test Host",
    "type": "episode",
    "category": "test",
    "description": "Test description",
    "audio_url": "/test.m4a",
    "cover": "/test.jpg"
}

try:
    response = requests.post(
        f"{API_BASE_URL}/api/podcasts/",
        headers={"Content-Type": "application/json"},
        json=test_data
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    if response.status_code == 200:
        print("✅ Podcast created successfully!")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"❌ Failed: {response.text}")
except Exception as e:
    print(f"❌ Error: {e}")

