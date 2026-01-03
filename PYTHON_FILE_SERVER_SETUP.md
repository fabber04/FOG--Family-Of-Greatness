# Python File Server Setup Guide

This guide explains how to set up and use the Python file server for storing podcasts, images, and other media files on the FOG platform.

## Overview

The Python file server provides:
- ✅ Centralized file storage in a dedicated `storage/` directory
- ✅ Organized folder structure (podcasts, images, documents)
- ✅ Automatic file management with unique filenames
- ✅ Fast file serving through FastAPI static file mounting
- ✅ No external dependencies (no Firebase, no cloud services)
- ✅ Full control over your files

## File Structure

Files are stored in the following structure:

```
storage/
└── files/
    ├── podcasts/
    │   ├── audio/          # Podcast audio files (.mp3, .m4a, etc.)
    │   └── covers/         # Podcast cover images
    ├── images/
    │   ├── events/         # Event images
    │   ├── courses/       # Course images
    │   ├── library/       # Library images
    │   └── general/       # General images
    └── documents/
        ├── library/       # Library documents
        └── courses/      # Course documents
```

## Quick Start

### Step 1: Initialize Storage

The storage directories are automatically created when you start the backend server. You can also initialize them manually:

```bash
cd backend
python file_server.py
```

This will create all necessary directories and show storage information.

### Step 2: Start the Backend Server

```bash
cd backend
python main.py
```

The server will:
- ✅ Initialize storage directories automatically
- ✅ Mount the storage directory at `/storage` endpoint
- ✅ Serve files from `storage/files/` directory

### Step 3: Upload Files

Files can be uploaded through:
1. **Admin Panel** - Web interface at `http://localhost:3000/admin/podcasts`
2. **API Endpoints** - Direct API calls to `/api/podcasts/upload-audio` and `/api/podcasts/upload-cover`
3. **Python Script** - Use `upload_podcasts.py` for batch uploads

## File Access

### Public URLs

Files uploaded through the file server are accessible via:

```
http://localhost:8000/storage/podcasts/audio/20250101_120000_abc123.m4a
http://localhost:8000/storage/podcasts/covers/20250101_120000_xyz789.jpeg
```

### URL Format

- **Base URL**: `http://localhost:8000/storage/`
- **Path**: `{category}/{subcategory}/{filename}`
- **Example**: `/storage/podcasts/audio/20250101_120000_abc123.m4a`

## Supported File Types

### Audio Files
- `.mp3` - MPEG Audio
- `.m4a` - MPEG-4 Audio
- `.wav` - Waveform Audio
- `.ogg` - Ogg Vorbis
- `.aac` - Advanced Audio Coding
- `.mp4` - MPEG-4 (audio)

### Image Files
- `.jpg`, `.jpeg` - JPEG images
- `.png` - PNG images
- `.gif` - GIF images
- `.webp` - WebP images

### Document Files
- `.pdf` - PDF documents
- `.doc`, `.docx` - Word documents
- `.txt` - Text files
- `.md` - Markdown files

## Configuration

### Storage Location

By default, files are stored in:
```
{project_root}/storage/files/
```

You can change this by modifying `BASE_STORAGE_DIR` in `backend/file_server.py`:

```python
BASE_STORAGE_DIR = Path(__file__).parent.parent / "storage"
```

### Storage Mode

The backend uses local Python file server by default. To change this, set in `.env`:

```env
STORAGE_MODE=local  # Use Python file server (default)
STORAGE_MODE=firebase  # Use Firebase Storage (if configured)
```

## API Usage

### Upload Podcast Cover Image

```bash
POST /api/podcasts/upload-cover
Content-Type: multipart/form-data
Authorization: Bearer {token}

file: {image_file}
```

**Response:**
```json
{
  "filename": "original_name.jpeg",
  "url": "/storage/podcasts/covers/20250101_120000_abc123.jpeg"
}
```

### Upload Podcast Audio

```bash
POST /api/podcasts/upload-audio
Content-Type: multipart/form-data
Authorization: Bearer {token}

file: {audio_file}
```

**Response:**
```json
{
  "filename": "original_name.m4a",
  "url": "/storage/podcasts/audio/20250101_120000_def456.m4a"
}
```

## File Naming

Files are automatically renamed with:
- **Timestamp**: `YYYYMMDD_HHMMSS`
- **Unique ID**: 8-character hexadecimal
- **Original Extension**: Preserved from original file

**Example:**
- Original: `My Podcast Episode.m4a`
- Stored: `20250101_120000_abc12345.m4a`

This ensures:
- ✅ No filename conflicts
- ✅ Chronological organization
- ✅ Easy identification

## Storage Management

### Check Storage Usage

Run the file server script to see storage information:

```bash
cd backend
python file_server.py
```

Output:
```
📊 Storage Information:
   Location: /path/to/storage/files
   Files: 42
   Size: 125.5 MB (0.12 GB)
```

### Delete Files

Files are automatically deleted when:
- A podcast is deleted through the admin panel
- A podcast is deleted via API

Manual deletion:
```python
from file_server import delete_file

# Delete by URL
delete_file("/storage/podcasts/audio/20250101_120000_abc123.m4a")
```

## Migration from Legacy Storage

If you have files in the old `backend/uploads/` directory:

1. **Files are still accessible** at `/uploads/` endpoint
2. **New uploads** go to `storage/files/` directory
3. **Migration script** (optional):

```python
from pathlib import Path
from file_server import save_file_from_path

# Migrate old files
old_uploads = Path("backend/uploads/podcasts")
for file in old_uploads.rglob("*"):
    if file.is_file():
        save_file_from_path(
            str(file),
            category="podcasts",
            subcategory="audio" if "audio" in str(file) else "covers",
            file_type="audio" if file.suffix in [".mp3", ".m4a", ".wav"] else "image"
        )
```

## Troubleshooting

### "Storage directory not found"
- Run `python backend/file_server.py` to initialize
- Check that `storage/files/` directory exists
- Verify file permissions

### "File not accessible via URL"
- Check that backend server is running
- Verify file exists in `storage/files/` directory
- Check URL path matches file location
- Ensure FastAPI mounted `/storage` endpoint

### "Permission denied" errors
- Check file permissions on `storage/` directory
- Ensure Python process has write access
- On Linux/Mac: `chmod -R 755 storage/`

### Files not appearing after upload
- Check backend logs for errors
- Verify `STORAGE_MODE=local` in `.env`
- Check file size limits (if any)
- Verify disk space available

## Best Practices

1. **Regular Backups**
   - Backup `storage/files/` directory regularly
   - Consider automated backup scripts

2. **Disk Space Monitoring**
   - Monitor storage directory size
   - Set up alerts for low disk space
   - Clean up old/unused files periodically

3. **File Organization**
   - Use appropriate categories and subcategories
   - Don't store files outside the storage structure
   - Keep original filenames in database for reference

4. **Security**
   - Files are publicly accessible via `/storage/` endpoint
   - Consider adding authentication for sensitive files
   - Use HTTPS in production

## Production Deployment

### For Production:

1. **Use a dedicated storage volume**
   ```python
   BASE_STORAGE_DIR = Path("/var/www/fog/storage")
   ```

2. **Set up backups**
   - Regular backups of `storage/files/` directory
   - Consider cloud backup solutions

3. **Monitor storage**
   - Set up disk space monitoring
   - Implement file cleanup policies

4. **CDN Integration** (optional)
   - Serve files through CDN for better performance
   - Update URLs to point to CDN

## Next Steps

1. ✅ Initialize storage: `python backend/file_server.py`
2. ✅ Start backend: `python backend/main.py`
3. ✅ Test upload through admin panel
4. ✅ Verify files accessible via `/storage/` URLs
5. ✅ Upload your podcast files!

## Support

For issues:
- Check backend logs for error messages
- Verify storage directory exists and is writable
- Test file upload with a small test file first
- Review file permissions

