#!/usr/bin/env python3
"""
Upload a single podcast episode
Usage: python upload_one.py <episode_number>
Example: python upload_one.py 1
"""

import os
import sys
import requests
from pathlib import Path

API_BASE_URL = "https://fog-family-of-greatness-production.up.railway.app"

# Import metadata from upload_podcasts.py
PODCASTS_FOLDER = Path(__file__).parent / "BEYOND THE DATING GAME-20251209T191233Z-1-001" / "BEYOND THE DATING GAME"
IMAGES_FOLDER = Path(__file__).parent / "public" / "images" / "podcasts"

PODCAST_METADATA = [
    {"filename": "Eps 01 Beyond The Dating Game.m4a", "title": "Episode 01: Beyond The Dating Game", "host": "FOG Relationship Team", "type": "episode", "category": "beyond-dating-game", "description": "Introduction to moving beyond superficial dating and discovering how to build meaningful, lasting relationships.", "coverImage": "Beyond the dating Game.jpeg", "tags": "relationships, dating, love, christian"},
    {"filename": "Esp 02 Study God to understand true love.m4a", "title": "Episode 02: Study God to Understand True Love", "host": "FOG Relationship Team", "type": "episode", "category": "beyond-dating-game", "description": "Understanding true love through studying God's word and His design for relationships.", "coverImage": "Beyond the dating Game.jpeg", "tags": "relationships, love, god, biblical"},
    {"filename": "Eps 03 The mother of all relationships.m4a", "title": "Episode 03: The Mother of All Relationships", "host": "FOG Relationship Team", "type": "episode", "category": "beyond-dating-game", "description": "Exploring the foundational relationship that shapes all others in our lives.", "coverImage": "Beyond the dating Game.jpeg", "tags": "relationships, foundation, family"},
    {"filename": "Eps 04 Love is not a game but a garden.m4a", "title": "Episode 04: Love is Not a Game But a Garden", "host": "FOG Relationship Team", "type": "episode", "category": "beyond-dating-game", "description": "Understanding that love requires cultivation, care, and patience like a garden.", "coverImage": "Beyond the dating Game.jpeg", "tags": "love, relationships, growth, patience"},
    {"filename": "Eps 05 Who is teaching you about relationships.m4a", "title": "Episode 05: Who is Teaching You About Relationships?", "host": "FOG Relationship Team", "type": "episode", "category": "beyond-dating-game", "description": "Examining the sources of our relationship knowledge and ensuring we learn from the right teachers.", "coverImage": "Beyond the dating Game.jpeg", "tags": "relationships, wisdom, learning, teaching"},
    {"filename": "Eps 06 Loneliness is not cured by a relationship.m4a", "title": "Episode 06: Loneliness is Not Cured by a Relationship", "host": "FOG Relationship Team", "type": "episode", "category": "beyond-dating-game", "description": "Understanding that relationships cannot fill the void of loneliness - finding wholeness in Christ first.", "coverImage": "Beyond the dating Game.jpeg", "tags": "loneliness, relationships, healing, wholeness"},
    {"filename": "Eps 07 Falling in love is easy but staying....m4a", "title": "Episode 07: Falling in Love is Easy But Staying in Love", "host": "FOG Relationship Team", "type": "episode", "category": "beyond-dating-game", "description": "The difference between falling in love and staying in love - commitment and intentionality.", "coverImage": "Beyond the dating Game.jpeg", "tags": "love, commitment, relationships, staying power"},
    {"filename": "Eps 08 Defining A Godly relationship.m4a", "title": "Episode 08: Defining A Godly Relationship", "host": "FOG Relationship Team", "type": "episode", "category": "beyond-dating-game", "description": "What makes a relationship godly and how to build one according to biblical principles.", "coverImage": "Beyond the dating Game.jpeg", "tags": "godly, relationships, biblical, principles"},
    {"filename": "Eps 09 Who are you glorifying in your relationship.m4a", "title": "Episode 09: Who Are You Glorifying in Your Relationship?", "host": "FOG Relationship Team", "type": "episode", "category": "beyond-dating-game", "description": "Ensuring your relationship brings glory to God rather than seeking self-glorification.", "coverImage": "Beyond the dating Game.jpeg", "tags": "glory, god, relationships, purpose"},
    {"filename": "Eps 11 Your partner should not stop you but help you.m4a", "title": "Episode 11: Your Partner Should Not Stop You But Help You", "host": "FOG Relationship Team", "type": "episode", "category": "beyond-dating-game", "description": "A godly partner supports and encourages your growth rather than hindering it.", "coverImage": "Beyond the dating Game.jpeg", "tags": "partnership, support, growth, relationships"},
    {"filename": "Eps 12 Teenage Emotions and Mentality.m4a", "title": "Episode 12: Teenage Emotions and Mentality", "host": "FOG Relationship Team", "type": "episode", "category": "wisdom-for-teenagers", "description": "Understanding and managing teenage emotions and developing a mature mindset.", "coverImage": "wisdom for teenagers.jpeg", "tags": "teenagers, emotions, maturity, wisdom"},
    {"filename": "Eps 13 Love is not a feeling.m4a", "title": "Episode 13: Love is Not a Feeling", "host": "FOG Relationship Team", "type": "episode", "category": "beyond-dating-game", "description": "Understanding that love is a choice and commitment, not just an emotion.", "coverImage": "Beyond the dating Game.jpeg", "tags": "love, commitment, choice, relationships"},
    {"filename": "Eps 14 Trap vs treasure.m4a", "title": "Episode 14: Trap vs Treasure", "host": "FOG Relationship Team", "type": "episode", "category": "beyond-dating-game", "description": "Learning to discern between relationships that trap you and those that are true treasures.", "coverImage": "Beyond the dating Game.jpeg", "tags": "discernment, relationships, wisdom, treasure"},
    {"filename": "Eps 15 Don_t just play learn in that relationship.m4a", "title": "Episode 15: Don't Just Play, Learn in That Relationship", "host": "FOG Relationship Team", "type": "episode", "category": "beyond-dating-game", "description": "Using relationships as opportunities for growth and learning rather than just entertainment.", "coverImage": "Beyond the dating Game.jpeg", "tags": "learning, growth, relationships, maturity"},
    {"filename": "Eps 16 Ignorance makes love loud but short lived.m4a", "title": "Episode 16: Ignorance Makes Love Loud But Short Lived", "host": "FOG Relationship Team", "type": "episode", "category": "beyond-dating-game", "description": "How lack of knowledge can make relationships intense but unsustainable.", "coverImage": "Beyond the dating Game.jpeg", "tags": "ignorance, knowledge, relationships, sustainability"},
    {"filename": "Eps 17 Age does not qualify you for love.m4a", "title": "Episode 17: Age Does Not Qualify You for Love", "host": "FOG Relationship Team", "type": "episode", "category": "beyond-dating-game", "description": "Age alone doesn't make you ready for love - maturity and wisdom are what matter.", "coverImage": "Beyond the dating Game.jpeg", "tags": "age, maturity, love, readiness"},
    {"filename": "Eps 18 Focus On Becoming The right partner.m4a", "title": "Episode 18: Focus On Becoming The Right Partner", "host": "FOG Relationship Team", "type": "episode", "category": "beyond-dating-game", "description": "Instead of looking for the right person, focus on becoming the right person.", "coverImage": "Beyond the dating Game.jpeg", "tags": "growth, self-improvement, relationships, becoming"},
    {"filename": "Eps 19 Ignorance turns a blessing to be a burden.m4a", "title": "Episode 19: Ignorance Turns a Blessing to Be a Burden", "host": "FOG Relationship Team", "type": "episode", "category": "beyond-dating-game", "description": "How lack of knowledge can turn God's blessings into burdens in relationships.", "coverImage": "Beyond the dating Game.jpeg", "tags": "ignorance, blessings, relationships, wisdom"},
    {"filename": "Eps 20 Quality preparation.m4a", "title": "Episode 20: Quality Preparation", "host": "FOG Relationship Team", "type": "episode", "category": "beyond-dating-game", "description": "The importance of preparing yourself for a quality relationship.", "coverImage": "Beyond the dating Game.jpeg", "tags": "preparation, quality, relationships, readiness"},
    {"filename": "Eps 21 Never confuse lust for love.m4a", "title": "Episode 21: Never Confuse Lust for Love", "host": "FOG Relationship Team", "type": "episode", "category": "beyond-dating-game", "description": "Understanding the critical difference between lust and genuine love.", "coverImage": "Beyond the dating Game.jpeg", "tags": "lust, love, relationships, discernment"},
    {"filename": "Eps 22 Heal before the relationship.m4a", "title": "Episode 22: Heal Before The Relationship", "host": "FOG Relationship Team", "type": "episode", "category": "beyond-dating-game", "description": "The importance of healing from past hurts before entering new relationships.", "coverImage": "Beyond the dating Game.jpeg", "tags": "healing, relationships, wholeness, preparation"}
]

def upload_episode(episode_num):
    """Upload a single episode by number (1-21)."""
    if episode_num < 1 or episode_num > len(PODCAST_METADATA):
        print(f"❌ Invalid episode number. Must be between 1 and {len(PODCAST_METADATA)}")
        return False
    
    metadata = PODCAST_METADATA[episode_num - 1]
    audio_path = PODCASTS_FOLDER / metadata["filename"]
    cover_path = IMAGES_FOLDER / metadata["coverImage"]
    
    print(f"\n📻 Uploading: {metadata['title']}")
    print("=" * 60)
    
    try:
        # Upload audio
        if not audio_path.exists():
            print(f"⚠️  Audio file not found: {audio_path}")
            audio_url = None
        else:
            print("📤 Uploading audio...")
            with open(audio_path, "rb") as f:
                files = {"file": (metadata["filename"], f, "audio/m4a")}
                response = requests.post(f"{API_BASE_URL}/api/podcasts/upload-audio", files=files)
            if response.ok:
                audio_url = response.json().get("url")
                print(f"✅ Audio uploaded: {audio_url}")
            else:
                print(f"❌ Audio upload failed: {response.text}")
                return False
        
        # Upload cover
        if not cover_path.exists():
            print(f"⚠️  Cover image not found: {cover_path}")
            cover_url = None
        else:
            print("📤 Uploading cover...")
            with open(cover_path, "rb") as f:
                files = {"file": (metadata["coverImage"], f, "image/jpeg")}
                response = requests.post(f"{API_BASE_URL}/api/podcasts/upload-cover", files=files)
            if response.ok:
                cover_url = response.json().get("url")
                print(f"✅ Cover uploaded: {cover_url}")
            else:
                print(f"❌ Cover upload failed: {response.text}")
                return False
        
        # Create podcast entry
        print("📝 Creating podcast entry...")
        podcast_data = {
            "title": metadata["title"],
            "host": metadata["host"],
            "type": metadata["type"],
            "category": metadata["category"],
            "description": metadata["description"],
            "audio_url": audio_url,
            "cover": cover_url,
            "tags": metadata["tags"],
            "duration": None,
            "is_live": False,
            "is_free": True
        }
        
        response = requests.post(
            f"{API_BASE_URL}/api/podcasts/",
            headers={"Content-Type": "application/json"},
            json=podcast_data
        )
        
        if response.ok:
            result = response.json()
            print(f"✅ Podcast created with ID: {result.get('id')}")
            return True
        else:
            print(f"❌ Failed to create podcast: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python upload_one.py <episode_number>")
        print(f"Available episodes: 1-{len(PODCAST_METADATA)}")
        print("\nExample: python upload_one.py 1")
        sys.exit(1)
    
    try:
        episode_num = int(sys.argv[1])
        success = upload_episode(episode_num)
        sys.exit(0 if success else 1)
    except ValueError:
        print(f"❌ Invalid episode number: {sys.argv[1]}")
        sys.exit(1)

