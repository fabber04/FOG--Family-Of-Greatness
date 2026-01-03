# How to Create Tables in Railway PostgreSQL

## Method 1: Using Railway's Query Tab (Easiest)

1. **Go to Railway Dashboard**
   - Navigate to your PostgreSQL service
   - Click on the **"Database"** tab
   - Click on **"Query"** (or look for a SQL query interface)

2. **Copy and Paste the SQL**
   - Open the file `create_tables.sql` in this directory
   - Copy all the SQL code
   - Paste it into Railway's Query interface
   - Click **"Run"** or **"Execute"**

3. **Verify Tables Created**
   - Go back to the **"Data"** tab
   - You should now see all 8 tables listed!

## Method 2: Using Railway's Connect Feature

1. **Get Connection String**
   - In Railway, go to PostgreSQL service → **"Database"** tab
   - Click **"Connect"** button
   - Copy the connection string (it will look like: `postgresql://user:pass@host:port/dbname`)

2. **Use a Database Client**
   - Install a PostgreSQL client (pgAdmin, DBeaver, TablePlus, or use `psql` command line)
   - Connect using the connection string
   - Run the SQL from `create_tables.sql`

## Method 3: Using psql Command Line

```bash
# Install psql if needed
# On macOS: brew install postgresql
# On Ubuntu: sudo apt-get install postgresql-client

# Connect to Railway database
psql "postgresql://user:pass@host:port/dbname"

# Then run the SQL file
\i create_tables.sql
```

## Tables That Will Be Created

1. **users** - User accounts and authentication
2. **library_items** - Books, blogs, quotes
3. **prayer_requests** - Prayer request submissions
4. **events** - Church events and activities
5. **podcasts** - Podcast episodes
6. **genius_academy_courses** - Course content
7. **devotionals** - Daily devotionals
8. **announcements** - Platform announcements

## After Creating Tables

Once tables are created, you can:
- See them in Railway's "Data" tab
- Use the API endpoints to add data
- Upload podcasts using `python upload_all_manual.py`

## Troubleshooting

If you get errors:
- Make sure you're connected to the correct database
- Check that you have the right permissions
- Some tables might already exist (the script uses `CREATE TABLE IF NOT EXISTS`)

