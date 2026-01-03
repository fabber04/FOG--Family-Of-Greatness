#!/bin/bash
# Run SQL queries on Railway PostgreSQL database

CONNECTION_STRING="postgresql://postgres:uJfgOyLyqoeBVIxRbpFklOBtbAwLiMgK@turntable.proxy.rlwy.net:49383/railway"

echo "📊 Querying Railway PostgreSQL database..."
echo "="
echo ""

# Query podcasts
psql "$CONNECTION_STRING" -c "SELECT COUNT(*) as total_podcasts FROM podcasts;"

echo ""
echo "📋 First 5 podcasts:"
psql "$CONNECTION_STRING" -c "SELECT id, title, category FROM podcasts ORDER BY id LIMIT 5;"

echo ""
echo "📋 All tables:"
psql "$CONNECTION_STRING" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"

