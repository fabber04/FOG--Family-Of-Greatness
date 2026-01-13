# How to Add Podcasts to the Database

## Quick Start

You have **3 options** to add podcasts to your database:

### Option 1: Use the Upload Script (Recommended) ⭐

This is the easiest way if you have podcast files locally.

#### Step 1: Prepare Your Files

1. **Organize your podcast files:**
   - Audio files (`.m4a`, `.mp3`, `.wav`, etc.) in a folder
   - Cover images (`.jpeg`, `.jpg`, `.png`) in `public/images/podcasts/`

2. **Example structure:**
   ```
   FOG--Family-Of-Greatness/
   ├── BEYOND THE DATING GAME/          # Your audio files folder
   │   ├── Episode 01.m4a
   │   ├── Episode 02.m4a
   │   └── ...
   └── public/images/podcasts/          # Your cover images
       ├── Beyond the dating Game.jpeg
       └── ...
   ```

#### Step 2: Update the Upload Script

1. **Open `upload_podcasts.py`**

2. **Update the folder paths:**
   ```python
   PODCASTS_FOLDER = Path(__file__).parent / "BEYOND THE DATING GAME"  # Your audio folder
   IMAGES_FOLDER = Path(__file__).parent / "public" / "images" / "podcasts"  # Your images folder
   ```

3. **Add your podcast metadata to `PODCAST_METADATA` list:**
   ```python
   PODCAST_METADATA = [
       {
           "filename": "Episode 01.m4a",                    # Audio filename
           "title": "Episode 01: Your Podcast Title",        # Display title
           "host": "FOG Relationship Team",                  # Host name
           "type": "episode",                                # "episode", "live", or "series"
           "category": "beyond-dating-game",                 # Category ID (see below)
           "description": "Your podcast description here",   # Description
           "coverImage": "Beyond the dating Game.jpeg",       # Cover image filename
           "tags": "relationships, love, christian"         # Comma-separated tags
       },
       # Add more podcasts here...
   ]
   ```

#### Step 3: Run the Script

```bash
cd /home/fab/Documents/Projects/FOG--Family-Of-Greatness
python3 upload_podcasts.py
```

The script will:
1. ✅ Upload each audio file to the backend
2. ✅ Upload each cover image to the backend
3. ✅ Create podcast entries in the database
4. ✅ Show progress and any errors

---

### Option 2: Use the Admin Panel (Web Interface)

If you have the admin panel enabled:

1. **Go to:** `https://familyofgreatness.com/#/admin/podcasts`
2. **Click "Add New Podcast"**
3. **Fill in the form:**
   - Upload audio file
   - Upload cover image
   - Enter title, description, category, etc.
4. **Click "Save"**

---

### Option 3: Manual API Calls

For advanced users or automation:

#### Upload Audio File
```bash
curl -X POST https://fog-backend-iyhz.onrender.com/api/podcasts/upload-audio \
  -F "file=@/path/to/your/audio.m4a"
```

#### Upload Cover Image
```bash
curl -X POST https://fog-backend-iyhz.onrender.com/api/podcasts/upload-cover \
  -F "file=@/path/to/your/cover.jpeg"
```

#### Create Podcast Entry
```bash
curl -X POST https://fog-backend-iyhz.onrender.com/api/podcasts/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Episode 01: Your Title",
    "host": "FOG Relationship Team",
    "type": "episode",
    "category": "beyond-dating-game",
    "description": "Your description",
    "audio_url": "/storage/podcasts/audio/Episode 01.m4a",
    "cover": "/storage/podcasts/covers/cover.jpeg",
    "tags": "relationships, love",
    "is_free": true,
    "is_live": false
  }'
```

---

## Podcast Categories

Use these **exact category IDs** when adding podcasts:

- `spiritual-development` - Spiritual Development
- `relationships` - Relationships
- `personal-development` - Personal Development
- `wisdom-keys` - Wisdom Keys
- `beyond-dating-game` - Beyond The Dating Game
- `wisdom-for-ladies` - Wisdom For Ladies
- `teens` - Teens Podcasts
- `university-students` - University Students

---

## Podcast Types

- `episode` - Regular episode
- `live` - Live recording
- `series` - Part of a series

---

## Current Status

✅ **Backend API:** `https://fog-backend-iyhz.onrender.com`  
✅ **Current Podcasts:** 21 podcasts in database  
✅ **File Storage:** Local storage (Python file server)  
✅ **Authentication:** Temporarily disabled (no token needed)

---

## Troubleshooting

### Podcasts Not Showing on Website

1. **Check if podcasts are in database:**
   ```bash
   curl https://fog-backend-iyhz.onrender.com/api/podcasts/ | python3 -m json.tool
   ```

2. **Check browser console:**
   - Press `F12` → Console tab
   - Look for API errors

3. **Clear browser cache:**
   - Press `Ctrl+Shift+R` (hard refresh)

4. **Verify frontend is deployed:**
   - Check GitHub Actions for latest deployment
   - Visit: `https://familyofgreatness.com/#/podcasts`

### Upload Errors

1. **File not found:**
   - Check file paths in `upload_podcasts.py`
   - Make sure files exist in the specified folders

2. **API connection error:**
   - Check if backend is running: `curl https://fog-backend-iyhz.onrender.com/api/health`
   - Check your internet connection

3. **Invalid category:**
   - Use one of the category IDs listed above
   - Category names are case-sensitive

---

## Example: Adding a Single Podcast

```python
# In upload_podcasts.py, add to PODCAST_METADATA:

{
    "filename": "New Episode.m4a",
    "title": "New Episode: Title Here",
    "host": "FOG Relationship Team",
    "type": "episode",
    "category": "beyond-dating-game",
    "description": "This is a new episode about relationships.",
    "coverImage": "Beyond the dating Game.jpeg",
    "tags": "relationships, love, christian"
}
```

Then run:
```bash
python3 upload_podcasts.py
```

---

## Need Help?

- Check `GOOGLE_DRIVE_UPLOAD_INSTRUCTIONS.md` for Google Drive setup
- Check `DEBUG_PODCASTS.md` for debugging tips
- Verify API is working: `curl https://fog-backend-iyhz.onrender.com/api/health`

