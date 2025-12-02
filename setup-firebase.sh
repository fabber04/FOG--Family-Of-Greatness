#!/bin/bash

echo "🔥 Firebase Setup Helper"
echo "========================"
echo ""

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    echo "Do you want to overwrite it? (y/n)"
    read -r response
    if [ "$response" != "y" ]; then
        echo "Cancelled. Exiting..."
        exit 0
    fi
fi

# Copy from example
echo "📋 Creating .env file from template..."
cp env.example .env

echo ""
echo "✅ .env file created!"
echo ""
echo "📝 Next steps:"
echo "1. Open .env file in a text editor"
echo "2. Get your Firebase config from: https://console.firebase.google.com/"
echo "3. Replace the placeholder values with your actual Firebase credentials"
echo "4. Save the file"
echo "5. Restart your development server (npm start)"
echo ""
echo "📖 For detailed instructions, see: FIREBASE_SETUP_QUICKSTART.md"
echo ""

