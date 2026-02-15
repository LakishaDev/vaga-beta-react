#!/bin/bash

# Cloudflare Pages - Quick Deploy Script
# Ovaj skript automatizuje build i deployment proces

set -e

echo "🚀 Vaga Beta - Cloudflare Pages Deploy Script"
echo "=============================================="
echo ""

# Proverite da li je .env.local konfigurisan
if [ ! -f ".env.local" ]; then
    echo "❌ Greška: .env.local fajl nije pronađen"
    echo "   Kreirajte .env.local sa Firebase i Google Maps kredencijalne"
    exit 1
fi

# Korak 1: Instalacija zavisnosti
echo "📦 Instalujem zavisnosti..."
npm install --legacy-peer-deps

# Korak 2: Build
echo ""
echo "🔨 Pravim hybrid build (CSR + SSR)..."
npm run build:cloudflare

if [ $? -ne 0 ]; then
    echo "❌ Build neuspešan!"
    exit 1
fi

echo "✅ Build uspešan!"
echo ""

# Proveri da li postoje oba build-a
if [ ! -d "dist" ] || [ ! -f "functions/ssr-render.js" ]; then
    echo "❌ Greška: dist folder ili functions/ssr-render.js ne postoji!"
    echo "   Build nije uspeo da generiše sve potrebne fajlove."
    exit 1
fi

echo "✅ Client build: dist/"
echo "✅ Server build: functions/ssr-render.js"
echo ""

# Korak 3: Proverite Wrangler instalaciju
if ! command -v wrangler &> /dev/null; then
    echo "📥 Instaliram Wrangler CLI..."
    npm install -g wrangler
fi

# Korak 4: Deploy
echo "🌐 Uploadujem na Cloudflare Pages..."
echo ""

read -p "Unesi Cloudflare project name (vaga-beta-nesto): " project_name
project_name=${project_name:-vaga-beta-nesto}

# Upload dist folder (koji sadrži client build)
wrangler pages deploy dist --project-name=$project_name --commit-dirty=true

echo ""
echo "✅ Deploy završen!"
echo ""
echo "📊 Čekaj 30-60 sekundi da se deploy prosledi..."
echo ""
echo "🔗 Tvoja aplikacija je dostupna na:"
echo "   https://${project_name}.pages.dev"
echo "   https://vagabeta.rs (ako je custom domain konfigurisan)"
echo ""
echo "📋 Sledeći koraci:"
echo "   1. Testiraj stranicu sa 🔧 Debug dugme"
echo "   2. Proveri sve tri funkcionalnosti: R2, Firebase, Google Maps"
echo "   3. Monitor sa Cloudflare Analytics"
echo ""
echo "🎉 Uspešan deployment!"
