# Quick Deployment Test Script (PowerShell)
# Provera da li je sve spremno za deployment

Write-Host "🔍 Pre-deployment Test" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan
Write-Host ""

# 1. Check if builds exist
Write-Host "📦 Proveravam build foldere..." -ForegroundColor Yellow

if (Test-Path "dist/client") {
    Write-Host "✅ dist/client EXISTS" -ForegroundColor Green
    $clientSize = (Get-ChildItem dist/client -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "   Size: $([math]::Round($clientSize, 2)) MB" -ForegroundColor Gray
} else {
    Write-Host "❌ dist/client MISSING - Run: npm run build:client" -ForegroundColor Red
    exit 1
}

if (Test-Path "dist/server") {
    Write-Host "✅ dist/server EXISTS" -ForegroundColor Green
    $serverSize = (Get-ChildItem dist/server -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "   Size: $([math]::Round($serverSize, 2)) MB" -ForegroundColor Gray
} else {
    Write-Host "❌ dist/server MISSING - Run: npm run build:server" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 2. Check if entry-server-cloudflare.js exists
Write-Host "🔍 Proveravam SSR entry point..." -ForegroundColor Yellow
if (Test-Path "dist/server/entry-server-cloudflare.js") {
    Write-Host "✅ entry-server-cloudflare.js EXISTS" -ForegroundColor Green
} else {
    Write-Host "❌ entry-server-cloudflare.js MISSING" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 3. Check if index.html exists
Write-Host "🔍 Proveravam index.html..." -ForegroundColor Yellow
if (Test-Path "dist/client/index.html") {
    Write-Host "✅ index.html EXISTS" -ForegroundColor Green
} else {
    Write-Host "❌ index.html MISSING" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 4. Check if _middleware.js exists
Write-Host "🔍 Proveravam functions/_middleware.js..." -ForegroundColor Yellow
if (Test-Path "functions/_middleware.js") {
    Write-Host "✅ functions/_middleware.js EXISTS" -ForegroundColor Green
} else {
    Write-Host "❌ functions/_middleware.js MISSING" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 5. Check for /prodavnica in CSR_ROUTES
Write-Host "🔍 Proveravam CSR_ROUTES konfiguraciju..." -ForegroundColor Yellow
$middlewareContent = Get-Content "functions/_middleware.js" -Raw
if ($middlewareContent -match '"/prodavnica"') {
    Write-Host "✅ /prodavnica je u CSR_ROUTES" -ForegroundColor Green
} else {
    Write-Host "⚠️  /prodavnica NIJE u CSR_ROUTES - dodaj ga!" -ForegroundColor Yellow
}

Write-Host ""

# 6. Check .env.local
Write-Host "🔍 Proveravam .env.local..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "✅ .env.local EXISTS" -ForegroundColor Green
    
    $envContent = Get-Content ".env.local" -Raw
    
    # Check for required variables
    if ($envContent -match "VITE_FIREBASE_API_KEY") {
        Write-Host "   ✅ Firebase API key configured" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Firebase API key MISSING" -ForegroundColor Yellow
    }
    
    if ($envContent -match "VITE_GOOGLE_MAPS_API_KEY") {
        Write-Host "   ✅ Google Maps API key configured" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Google Maps API key MISSING" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  .env.local MISSING - lokalni development neće raditi" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Pre-deployment check završen!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Sledeći koraci:" -ForegroundColor Cyan
Write-Host "   1. Dodaj environment variables u Cloudflare Dashboard" -ForegroundColor White
Write-Host "   2. Pokreni: npx wrangler pages deploy dist/client --project-name=vaga-beta" -ForegroundColor White
Write-Host "   3. Test na production URL-u" -ForegroundColor White
Write-Host ""
