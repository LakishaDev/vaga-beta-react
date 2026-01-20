#!/bin/bash

# R2 Cache Deployment Script
# Automatski deploy R2 cache worker-a

set -e

# Boje za output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 R2 Cache Worker Deployment${NC}"
echo "=================================="
echo ""

# Provera okruženja
check_env() {
    echo -e "${BLUE}📋 Proveravanje okruženja...${NC}"
    
    if ! command -v wrangler &> /dev/null; then
        echo -e "${RED}❌ Wrangler nije instaliran${NC}"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js nije instaliran${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Sve zavisnosti OK${NC}"
    echo ""
}

# Validacija .env
validate_env() {
    echo -e "${BLUE}🔐 Validacija Cloudflare kredencijala...${NC}"
    
    if [ ! -f ".env" ]; then
        echo -e "${RED}❌ .env fajl nije pronađen${NC}"
        echo -e "${YELLOW}💡 Kopiraj .env.example: cp .env.example .env${NC}"
        exit 1
    fi
    
    # Proverite required vars
    source .env
    
    if [ -z "$VITE_CLOUDFLARE_ACCOUNT_ID" ]; then
        echo -e "${RED}❌ VITE_CLOUDFLARE_ACCOUNT_ID nije postavljen${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Kredencijali su OK${NC}"
    echo ""
}

# Test connection
test_connection() {
    echo -e "${BLUE}🌐 Testiranje konekcije sa Cloudflare...${NC}"
    
    if wrangler whoami &> /dev/null; then
        echo -e "${GREEN}✅ Konekcija OK${NC}"
    else
        echo -e "${RED}❌ Konekcija neuspešna${NC}"
        echo -e "${YELLOW}💡 Proverite CLOUDFLARE_API_TOKEN${NC}"
        exit 1
    fi
    echo ""
}

# Deployment
deploy_worker() {
    echo -e "${BLUE}📦 Deployovanje Worker-a...${NC}"
    
    if wrangler deploy src/workers/r2-cache-worker.js; then
        echo -e "${GREEN}✅ Worker je uspešno deployovan${NC}"
    else
        echo -e "${RED}❌ Deployment neuspešan${NC}"
        exit 1
    fi
    echo ""
}

# Health check
health_check() {
    echo -e "${BLUE}🏥 Health check Worker-a...${NC}"
    
    WORKER_URL="https://cache.vaga-beta.rs"
    
    if curl -f "$WORKER_URL/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Worker je dostupan${NC}"
        echo -e "   URL: ${BLUE}$WORKER_URL${NC}"
    else
        echo -e "${RED}❌ Worker nije dostupan${NC}"
        echo -e "${YELLOW}💡 Čekaj 1-2 minuta za propagaciju${NC}"
    fi
    echo ""
}

# Deployment status
show_status() {
    echo -e "${BLUE}📊 Deployment status:${NC}"
    echo ""
    echo "  Worker ID: $(wrangler deployments list | head -1 | awk '{print $1}')"
    echo "  Environment: production"
    echo "  Status: ✅ Active"
    echo ""
    echo -e "${GREEN}🎉 R2 Cache Worker je uspešno deployovan!${NC}"
    echo ""
}

# Main
main() {
    check_env
    validate_env
    test_connection
    deploy_worker
    health_check
    show_status
}

# Run
main
