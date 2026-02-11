# Cloudflare Pages - Quick Deploy Script (PowerShell)
# Ovaj skript automatizuje build i deployment proces za Windows

$ErrorActionPreference = "Stop"

Write-Host "🚀 Vaga Beta - Cloudflare Pages Deploy Script" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

# Proverite da li je .env.local konfigurisan
if (!(Test-Path ".env.local")) {
    Write-Host "❌ Greška: .env.local fajl nije pronađen" -ForegroundColor Red
    Write-Host "   Kreirajte .env.local sa Firebase i Google Maps kredencijalne" -ForegroundColor Yellow
    exit 1
}

# Korak 1: Instalacija zavisnosti
Write-Host "📦 Instalujem zavisnosti..." -ForegroundColor Cyan
npm install --legacy-peer-deps
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Instalacija zavisnosti neuspešna!" -ForegroundColor Red
    exit 1
}

# Korak 2: Build
Write-Host ""
Write-Host "🔨 Pravim production build..." -ForegroundColor Cyan
npm run build:prod

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build neuspešan!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build uspešan!" -ForegroundColor Green
Write-Host ""

# Korak 3: Proverite Wrangler instalaciju
$wranglerPath = npm root -g | % { Join-Path $_ ".bin/wrangler" }
if (!(Test-Path $wranglerPath)) {
    Write-Host "📥 Instaliram Wrangler CLI..." -ForegroundColor Cyan
    npm install -g wrangler
}

# Korak 4: Deploy
Write-Host "🌐 Uploadujem na Cloudflare Pages..." -ForegroundColor Cyan
Write-Host ""

$projectName = Read-Host "Unesi Cloudflare project name (vaga-beta)"
if ([string]::IsNullOrWhiteSpace($projectName)) {
    $projectName = "vaga-beta"
}

wrangler pages deploy dist --project-name=$projectName

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deploy neuspešan!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Deploy završen!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Čekaj 30-60 sekundi da se deploy prosledi..." -ForegroundColor Yellow
Write-Host ""
Write-Host "🔗 Tvoja aplikacija je dostupna na:" -ForegroundColor Green
Write-Host "   https://${projectName}.pages.dev"
Write-Host "   https://vagabeta.rs (ako je custom domain konfigurisan)"
Write-Host ""
Write-Host "📋 Sledeći koraci:" -ForegroundColor Cyan
Write-Host "   1. Testiraj stranicu sa 🔧 Debug dugme"
Write-Host "   2. Proveri sve tri funkcionalnosti: R2, Firebase, Google Maps"
Write-Host "   3. Monitor sa Cloudflare Analytics"
Write-Host ""
Write-Host "🎉 Uspešan deployment!" -ForegroundColor Green
