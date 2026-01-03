#!/bin/bash
# Connect to Railway PostgreSQL database

# Public connection string
CONNECTION_STRING="postgresql://postgres:uJfgOyLyqoeBVIxRbpFklOBtbAwLiMgK@turntable.proxy.rlwy.net:49383/railway"

echo "🔗 Connecting to Railway PostgreSQL database..."
echo "="
echo ""

# Connect using psql
psql "$CONNECTION_STRING"

