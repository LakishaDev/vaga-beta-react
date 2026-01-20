#!/bin/bash

# R2 Setup Script
# Automatsko postavljanje R2 Cache-a

set -e

echo "🚀 R2 Cloudflare Cache Setup"
echo "================================"

# 1. Provera instalacije
echo "📦 Proveravanje instalacije..."

if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler nije instaliran"
    echo "📦 Instaliranje Wrangler-a..."
    npm install --global wrangler
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js nije instaliran"
    exit 1
fi

echo "✅ Sve zavisnosti su instalirane"

# 2. Prikaži Cloudflare info
echo ""
echo "👤 Prikaži Cloudflare nalog:"
wrangler whoami

# 3. Kreiraj R2 bucket
echo ""
echo "📦 Kreiramo R2 bucket..."
if wrangler r2 bucket list | grep -q "vaga-beta-cache"; then
    echo "✅ Bucket 'vaga-beta-cache' već postoji"
else
    echo "📍 Kreiramo novi bucket..."
    wrangler r2 bucket create vaga-beta-cache
    echo "✅ Bucket je kreiran"
fi

# 4. Kreiraj KV namespace
echo ""
echo "🗄️  Kreiramo KV namespace..."
NAMESPACE_ID=$(wrangler kv:namespace create CACHE_METADATA --preview false 2>/dev/null | grep -oP '"id": "\K[^"]+' || echo "")

if [ -z "$NAMESPACE_ID" ]; then
    echo "⚠️  Koristimo postojeći KV namespace ili kreiraj ručno:"
    echo "wrangler kv:namespace create CACHE_METADATA --preview false"
else
    echo "✅ KV Namespace ID: $NAMESPACE_ID"
fi

# 5. Setup .env
echo ""
echo "📝 Konfigurisanje .env fajla..."

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ .env fajl je kreiran"
    echo ""
    echo "⚠️  VAŽNO: Molimo ažuriraj .env sa sledećim:"
    echo "   - VITE_CLOUDFLARE_ACCOUNT_ID"
    echo "   - VITE_CLOUDFLARE_API_TOKEN"
    echo "   - VITE_CLOUDFLARE_ZONE_ID"
else
    echo "✅ .env fajl već postoji"
fi

# 6. Ažuriranje wrangler.toml
echo ""
echo "🔧 Pročitaj wrangler.toml i ažuriraj:"
echo "   - account_id"
echo "   - zone_id (ako trebaš route binding)"
echo "   - KV namespace ID"

# 7. NPM dependencies
echo ""
echo "📥 Instaliranje NPM zavisnosti..."
npm install

# 8. Deploy instrukcije
echo ""
echo "✅ Setup je kompletan!"
echo ""
echo "📋 Sledeće korake:"
echo ""
echo "1. Ažurira .env fajl sa Cloudflare podacima:"
echo "   wrangler whoami  # Za account ID"
echo ""
echo "2. Ažurira wrangler.toml sa account_id i zone_id"
echo ""
echo "3. Deploy Worker-a:"
echo "   wrangler deploy src/workers/r2-cache-worker.js"
echo ""
echo "4. Testiraj health endpoint:"
echo "   curl https://cache.vaga-beta.rs/health"
echo ""
echo "5. Pročitaj R2_SETUP_GUIDE.md za detaljne instrukcije"
echo ""
