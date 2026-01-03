# How to Add PostgreSQL Database to Railway

## Why You Need This

Currently, your backend uses SQLite, which means:
- ❌ All data (users, podcasts, events, etc.) is lost on each deployment
- ❌ Database file is stored in the container (temporary)

Adding PostgreSQL will:
- ✅ Persist all data across deployments
- ✅ Keep your database safe and accessible
- ✅ Railway automatically configures everything

## Step-by-Step Guide

### Step 1: Add PostgreSQL Database

1. **Go to your Railway Dashboard**
   - You should see your backend service running

2. **Click the "+ New" button** (usually top right or in the project view)
   - This opens a dropdown menu

3. **Select "Database"** from the dropdown
   - Or look for "Add Database" / "PostgreSQL" option

4. **Click "Add PostgreSQL"**
   - Railway will create a new PostgreSQL service

### Step 2: Railway Auto-Configuration

Railway automatically:
- ✅ Creates a PostgreSQL database
- ✅ Sets the `DATABASE_URL` environment variable
- ✅ Links it to your backend service
- ✅ Handles all connection details

**You don't need to do anything else!** Your backend will automatically detect and use PostgreSQL.

### Step 3: Verify It's Working

1. **Check your Railway project**
   - You should now see TWO services:
     - Your backend service (the one running)
     - A new PostgreSQL service

2. **Check Environment Variables**
   - Go to your backend service → **Variables** tab
   - You should see `DATABASE_URL` automatically added
   - It will look like: `postgresql://user:password@host:port/dbname`

3. **Check Logs**
   - Go to your backend service → **Deployments** → Latest deployment → **View Logs**
   - On next deployment, it should connect to PostgreSQL
   - No errors = it's working!

### Step 4: Initial Database Setup

Your backend will automatically:
- ✅ Create all database tables on first startup
- ✅ Set up the schema (users, podcasts, events, etc.)

**Note**: Since this is a new database, you'll need to:
- Re-upload podcasts (if you had any)
- Users will need to register again
- But from now on, everything will persist!

## Visual Guide

```
Railway Dashboard
├── Your Backend Service (running)
└── [+ New] button
    └── Click "Database"
        └── Click "Add PostgreSQL"
            └── ✅ Database created!
                └── ✅ DATABASE_URL auto-set!
```

## Troubleshooting

### Can't Find "Database" Option?
- Make sure you're in the project view (not service view)
- Look for "+ New" or "Add Resource" button
- Some Railway interfaces show it as "New" → "Database" → "PostgreSQL"

### DATABASE_URL Not Showing?
- Wait a few seconds after creating the database
- Refresh the Variables page
- Check that the database service is linked to your backend service

### Connection Errors?
- Make sure both services are in the same Railway project
- Railway should auto-link them, but you can manually link if needed
- Check Railway logs for specific error messages

## After Adding Database

Once PostgreSQL is added:

1. **Your backend will automatically use it** (no code changes needed)
2. **Data will persist** across all deployments
3. **You can view data** using Railway's database tools or connect with a PostgreSQL client

## Next Steps

After adding the database:
1. ✅ Add environment variables (CORS_ORIGINS, ENVIRONMENT)
2. ✅ Test your API endpoints
3. ✅ Update frontend with Railway URL
4. ✅ Re-upload any content you need

---

**That's it!** Railway makes database setup super easy. Just click "Add PostgreSQL" and Railway handles the rest! 🚀

