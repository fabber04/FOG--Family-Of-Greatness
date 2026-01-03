# Railway Environment Variables Setup

## Required Variables for Production

In Railway's **Shared Variables** section (Project Settings → Shared Variables → production), add these variables:

### 1. CORS_ORIGINS (Required)
**Purpose**: Allows your GitHub Pages frontend to access the API

**Value**:
```
https://fabber04.github.io,http://localhost:3000
```

**How to add**:
1. Click the `{}` icon or "Add Variable" button
2. Key: `CORS_ORIGINS`
3. Value: `https://fabber04.github.io,http://localhost:3000`
4. Save

### 2. ENVIRONMENT (Recommended)
**Purpose**: Disables auto-reload in production

**Value**:
```
production
```

### 3. DATABASE_URL (Auto-provided if you add PostgreSQL)
**Purpose**: Database connection string

**Note**: Railway automatically sets this if you add a PostgreSQL database:
1. In Railway dashboard → Click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway automatically creates `DATABASE_URL` variable
3. Your backend will automatically use PostgreSQL

**If not using PostgreSQL**: The app will use SQLite (data resets on redeploy)

### 4. PORT (Auto-provided by Railway)
**Purpose**: Server port

**Note**: Railway automatically sets this. Don't manually add it.

---

## Optional Variables

### STORAGE_MODE (Optional)
**Purpose**: Choose file storage method

**Options**:
- `local` (default) - Files stored in Railway container (lost on redeploy)
- `firebase` - Files stored in Firebase Storage (persistent)

**Value** (if using Firebase):
```
firebase
```

### Firebase Variables (Only if STORAGE_MODE=firebase)
If you want to use Firebase Storage for file persistence:

- `FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket name
- `FIREBASE_CREDENTIALS`: Path to Firebase credentials JSON (or use Railway secrets)

---

## Quick Setup Steps

1. **Go to Railway Dashboard** → Your Project → **Settings** → **Shared Variables**

2. **Click "Add Variable"** (or the `{}` icon)

3. **Add these variables one by one**:

   | Variable Name | Value | Required |
   |--------------|-------|----------|
   | `CORS_ORIGINS` | `https://fabber04.github.io,http://localhost:3000` | ✅ Yes |
   | `ENVIRONMENT` | `production` | ✅ Recommended |

4. **Add PostgreSQL Database** (Recommended):
   - Railway Dashboard → **New** → **Database** → **Add PostgreSQL**
   - Railway automatically sets `DATABASE_URL`
   - Database persists across deployments

5. **Save and Redeploy**:
   - Railway will automatically redeploy when you add variables
   - Check logs to verify it's working

---

## Verification

After adding variables, check your Railway logs. You should see:
```
✅ Storage initialized at: /storage/files
INFO:     Uvicorn running on http://0.0.0.0:8080
```

Test your API:
```bash
curl https://your-railway-url.up.railway.app/api/health
```

Should return: `{"status":"healthy","message":"FOG API is running"}`

---

## Important Notes

- **CORS_ORIGINS**: Must include your GitHub Pages URL
- **DATABASE_URL**: Automatically set by Railway if you add PostgreSQL
- **PORT**: Automatically set by Railway (don't add manually)
- **File Storage**: Local storage is temporary. Consider Firebase Storage for production.

---

## Troubleshooting

### CORS Errors
- Make sure `CORS_ORIGINS` includes your frontend URL
- Check that variable name is exactly `CORS_ORIGINS` (case-sensitive)
- Redeploy after adding variables

### Database Connection Errors
- If using PostgreSQL, verify `DATABASE_URL` is set (Railway auto-sets it)
- Check Railway logs for connection errors
- Ensure PostgreSQL service is running

### Variables Not Working
- Variables are case-sensitive
- Make sure you're adding to the correct environment (production)
- Redeploy after adding variables
- Check Railway logs for errors

