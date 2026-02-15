#!/bin/bash

# Quick Deployment Test Script
# Provera da li je sve spremno za deployment

echo "🔍 Pre-deployment Test"
echo "======================="
echo ""

# 1. Check if builds exist
echo "📦 Proveravam build foldere..."

if [ -d "dist/client" ]; then
    echo "✅ dist/client EXISTS"
    CLIENT_SIZE=$(du -sh dist/client | cut -f1)
    echo "   Size: $CLIENT_SIZE"
else
    echo "❌ dist/client MISSING - Run: npm run build:client"
    exit 1
fi

if [ -d "dist/server" ]; then
    echo "✅ dist/server EXISTS"
    SERVER_SIZE=$(du -sh dist/server | cut -f1)
    echo "   Size: $SERVER_SIZE"
else
    echo "❌ dist/server MISSING - Run: npm run build:server"
    exit 1
fi

echo ""

# 2. Check if entry-server-cloudflare.js exists
echo "🔍 Proveravam SSR entry point..."
if [ -f "dist/server/entry-server-cloudflare.js" ]; then
    echo "✅ entry-server-cloudflare.js EXISTS"
else
    echo "❌ entry-server-cloudflare.js MISSING"
    exit 1
fi

echo ""

# 3. Check if index.html exists
echo "🔍 Proveravam index.html..."
if [ -f "dist/client/index.html" ]; then
    echo "✅ index.html EXISTS"
else
    echo "❌ index.html MISSING"
    exit 1
fi

echo ""

# 4. Check if _middleware.js exists
echo "🔍 Proveravam functions/_middleware.js..."
if [ -f "functions/_middleware.js" ]; then
    echo "✅ functions/_middleware.js EXISTS"
else
    echo "❌ functions/_middleware.js MISSING"
    exit 1
fi

echo ""

# 5. Check for /prodavnica in CSR_ROUTES
echo "🔍 Proveravam CSR_ROUTES konfiguraciju..."
if grep -q '"/prodavnica"' functions/_middleware.js; then
    echo "✅ /prodavnica je u CSR_ROUTES"
else
    echo "⚠️  /prodavnica NIJE u CSR_ROUTES - dodaj ga!"
fi

echo ""

# 6. Check .env.local
echo "🔍 Proveravam .env.local..."
if [ -f ".env.local" ]; then
    echo "✅ .env.local EXISTS"
    
    # Check for required variables
    if grep -q "VITE_FIREBASE_API_KEY" .env.local; then
        echo "   ✅ Firebase API key configured"
    else
        echo "   ⚠️  Firebase API key MISSING"
    fi
    
    if grep -q "VITE_GOOGLE_MAPS_API_KEY" .env.local; then
        echo "   ✅ Google Maps API key configured"
    else
        echo "   ⚠️  Google Maps API key MISSING"
    fi
else
    echo "⚠️  .env.local MISSING - lokalni development neće raditi"
fi

echo ""
echo "✅ Pre-deployment check završen!"
echo ""
echo "📋 Sledeći koraci:"
echo "   1. Dodaj environment variables u Cloudflare Dashboard"
echo "   2. Pokreni: npx wrangler pages deploy dist/client --project-name=vaga-beta"
echo "   3. Test na production URL-u"
echo ""
