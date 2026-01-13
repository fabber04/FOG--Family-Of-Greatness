#!/bin/bash
# Quick diagnostic script to check if podcasts are working

echo "🔍 Checking Podcast API Status..."
echo ""

echo "1. Testing Backend API Health:"
curl -s https://fog-backend-iyhz.onrender.com/api/health | python3 -m json.tool
echo ""

echo "2. Testing Podcasts Endpoint:"
PODCAST_COUNT=$(curl -s https://fog-backend-iyhz.onrender.com/api/podcasts/ | python3 -c "import sys, json; data = json.load(sys.stdin); print(len(data))" 2>/dev/null)
echo "   Found $PODCAST_COUNT podcasts in database"
echo ""

echo "3. Testing CORS (from familyofgreatness.com origin):"
curl -s -H "Origin: https://familyofgreatness.com" -H "Access-Control-Request-Method: GET" \
  -X OPTIONS https://fog-backend-iyhz.onrender.com/api/podcasts/ -v 2>&1 | grep -i "access-control" | head -5
echo ""

echo "4. Sample Podcast Data:"
curl -s https://fog-backend-iyhz.onrender.com/api/podcasts/ | python3 -m json.tool | head -30
echo ""

echo "5. Checking Frontend Deployment:"
echo "   Visit: https://familyofgreatness.com/#/podcasts"
echo "   Open browser console (F12) and check for:"
echo "   - 🔍 Loading podcasts from API..."
echo "   - ✅ Podcasts loaded: X items"
echo ""

if [ "$PODCAST_COUNT" -gt 0 ]; then
    echo "✅ Backend API is working with $PODCAST_COUNT podcasts"
    echo "⚠️  If podcasts aren't showing, check:"
    echo "   1. Browser console for errors"
    echo "   2. GitHub Actions deployment status"
    echo "   3. Clear browser cache (Ctrl+Shift+R)"
else
    echo "❌ No podcasts found in database!"
    echo "   Run: python3 upload_podcasts.py"
fi

