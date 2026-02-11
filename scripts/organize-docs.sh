#!/bin/bash
# Documentation Organization Script
# Moves all documentation files to organized structure

echo "🚀 Starting documentation organization..."

# Cloudflare deployment docs
echo "📁 Moving Cloudflare documentation..."
git mv CLOUDFLARE_COMPLETE_SETUP.md docs/deployment/cloudflare/COMPLETE_SETUP.md
git mv CLOUDFLARE_ENV_SETUP.md docs/deployment/cloudflare/ENV_SETUP.md
git mv CLOUDFLARE_GITHUB_SETUP.md docs/deployment/cloudflare/GITHUB_SETUP.md
git mv CLOUDFLARE_PAGES_DEPLOYMENT.md docs/deployment/cloudflare/PAGES_DEPLOYMENT.md
git mv START_CLOUDFLARE_DEPLOYMENT.md docs/deployment/cloudflare/QUICK_START.md
git mv URGENT_FIX_NEEDED.md docs/deployment/cloudflare/TROUBLESHOOTING.md
git mv CLOUDFLARE_SETUP_COMPLETE.md docs/summaries/deployment/CLOUDFLARE_SETUP_COMPLETE.md

# R2 Storage docs
echo "📁 Moving R2 Storage documentation..."
git mv START_HERE_R2.md docs/deployment/r2-storage/README.md
git mv R2_QUICK_START.md docs/deployment/r2-storage/QUICK_START.md
git mv R2_SETUP_GUIDE.md docs/deployment/r2-storage/SETUP_GUIDE.md
git mv R2_CACHE_README.md docs/deployment/r2-storage/CACHE_README.md
git mv R2_IMPLEMENTATION_CHECKLIST.md docs/deployment/r2-storage/IMPLEMENTATION_CHECKLIST.md
git mv R2_IMPLEMENTATION_COMPLETE.md docs/summaries/deployment/R2_IMPLEMENTATION_COMPLETE.md

# Deployment checklist
echo "📁 Moving deployment checklist..."
git mv PRE_DEPLOYMENT_CHECKLIST.md docs/deployment/PRE_DEPLOYMENT_CHECKLIST.md

# Setup docs
echo "📁 Moving setup documentation..."
git mv SECRETS_SETUP.md docs/setup/SECRETS_SETUP.md
git mv SECRETS_QUICK_START.md docs/setup/SECRETS_QUICK_START.md
git mv SETUP_COMPLETE.md docs/setup/SETUP_COMPLETE.md
git mv ADDITIONAL_RECOMMENDATIONS.md docs/setup/ADDITIONAL_RECOMMENDATIONS.md

# Optimistic UI docs
echo "📁 Moving Optimistic UI documentation..."
git mv OPTIMISTIC_UI_README.md docs/features/optimistic-ui/README.md 2>/dev/null || mkdir -p docs/features/optimistic-ui && mv OPTIMISTIC_UI_README.md docs/features/optimistic-ui/README.md
git mv OPTIMISTIC_UI_SUMMARY.md docs/features/optimistic-ui/IMPLEMENTATION.md 2>/dev/null || mv OPTIMISTIC_UI_SUMMARY.md docs/features/optimistic-ui/IMPLEMENTATION.md
git mv CHANGELOG_OPTIMISTIC_UI.md docs/features/optimistic-ui/CHANGELOG.md 2>/dev/null || mv CHANGELOG_OPTIMISTIC_UI.md docs/features/optimistic-ui/CHANGELOG.md
git mv docs/OPTIMISTIC_UI_GUIDE.md docs/features/optimistic-ui/GUIDE.md 2>/dev/null || true
git mv docs/MODAL_STUCK_FIX.md docs/features/optimistic-ui/MODAL_STUCK_FIX.md 2>/dev/null || true

# eVaga Desktop docs
echo "📁 Moving eVaga Desktop documentation..."
mkdir -p docs/features/evaga-desktop
git mv EVAGA_DESKTOP_INTEGRATION_SUMMARY.md docs/features/evaga-desktop/README.md 2>/dev/null || mv EVAGA_DESKTOP_INTEGRATION_SUMMARY.md docs/features/evaga-desktop/README.md
git mv docs/guides/evaga-desktop-integration.md docs/features/evaga-desktop/integration.md 2>/dev/null || true

# User Management docs
echo "📁 Moving User Management documentation..."
mkdir -p docs/features/user-management
git mv USER_MANAGEMENT_SUMMARY.md docs/features/user-management/README.md 2>/dev/null || mv USER_MANAGEMENT_SUMMARY.md docs/features/user-management/README.md

# SEO docs
echo "📁 Moving SEO documentation..."
mkdir -p docs/features/seo
git mv SEO_OPTIMIZATION_GUIDE.md docs/features/seo/OPTIMIZATION_GUIDE.md 2>/dev/null || mv SEO_OPTIMIZATION_GUIDE.md docs/features/seo/OPTIMIZATION_GUIDE.md

# Summaries
echo "📁 Moving summary documentation..."
git mv DEPLOYMENT_SUMMARY.md docs/summaries/deployment/DEPLOYMENT_SUMMARY.md 2>/dev/null || mv DEPLOYMENT_SUMMARY.md docs/summaries/deployment/DEPLOYMENT_SUMMARY.md
git mv DEPLOYMENT_FIX_SUMMARY.md docs/summaries/deployment/DEPLOYMENT_FIX_SUMMARY.md 2>/dev/null || mv DEPLOYMENT_FIX_SUMMARY.md docs/summaries/deployment/DEPLOYMENT_FIX_SUMMARY.md
git mv IMPLEMENTATION_SUMMARY.md docs/summaries/features/IMPLEMENTATION_SUMMARY.md 2>/dev/null || mv IMPLEMENTATION_SUMMARY.md docs/summaries/features/IMPLEMENTATION_SUMMARY.md
git mv FIX_COMPLETE_SUMMARY.md docs/summaries/features/FIX_COMPLETE_SUMMARY.md 2>/dev/null || mv FIX_COMPLETE_SUMMARY.md docs/summaries/features/FIX_COMPLETE_SUMMARY.md
git mv OPTIMIZATION_COMPLETE_SUMMARY.md docs/summaries/features/OPTIMIZATION_COMPLETE_SUMMARY.md 2>/dev/null || mv OPTIMIZATION_COMPLETE_SUMMARY.md docs/summaries/features/OPTIMIZATION_COMPLETE_SUMMARY.md

# Changelog & Version History
echo "📁 Moving changelog documentation..."
git mv docs/CHANGELOG.md docs/changelog/CHANGELOG.md 2>/dev/null || true
git mv docs/V1.1_UPDATE_SUMMARY.md docs/changelog/v1.1/UPDATE_SUMMARY.md 2>/dev/null || true
git mv docs/V1.1_TEST_CHECKLIST.md docs/changelog/v1.1/TEST_CHECKLIST.md 2>/dev/null || true

# Historical development docs
git mv docs/PART1_ICONS_COMPLETE.md docs/changelog/history/PART1_ICONS_COMPLETE.md 2>/dev/null || true
git mv docs/PART2_RESPONSIVE_COMPLETE.md docs/changelog/history/PART2_RESPONSIVE_COMPLETE.md 2>/dev/null || true
git mv docs/PART2_RESPONSIVE_IN_PROGRESS.md docs/changelog/history/PART2_RESPONSIVE_IN_PROGRESS.md 2>/dev/null || true
git mv docs/PART3_MODAL_DRAWER_COMPLETE.md docs/changelog/history/PART3_MODAL_DRAWER_COMPLETE.md 2>/dev/null || true
git mv docs/DEO3_FINAL_SUMMARY.md docs/changelog/history/DEO3_FINAL_SUMMARY.md 2>/dev/null || true
git mv docs/DEO3_QUICK_RECAP.md docs/changelog/history/DEO3_QUICK_RECAP.md 2>/dev/null || true
git mv docs/DEO4_COMPLETE.md docs/changelog/history/DEO4_COMPLETE.md 2>/dev/null || true
git mv docs/DEO4_IN_PROGRESS.md docs/changelog/history/DEO4_IN_PROGRESS.md 2>/dev/null || true

# Status docs
git mv docs/FINAL_STATUS.md docs/summaries/status/FINAL_STATUS.md 2>/dev/null || true
git mv docs/FILES_CHANGED.md docs/summaries/status/FILES_CHANGED.md 2>/dev/null || true
git mv docs/ADMIN_LICENSING_OPTIMIZATION_PROGRESS.md docs/summaries/features/ADMIN_LICENSING_OPTIMIZATION_PROGRESS.md 2>/dev/null || true

# Testing docs
git mv docs/TESTING_CHECKLIST.md docs/testing/TESTING_CHECKLIST.md 2>/dev/null || true

# Guides
git mv docs/ANIMATED_ICONS_GUIDE.md docs/guides/ANIMATED_ICONS_GUIDE.md 2>/dev/null || true

# Clean up legacy/index files (move to archive or consolidate)
echo "📁 Archiving legacy documentation..."
mkdir -p docs/summaries/legacy
git mv CLOUDFLARE_INDEX.md docs/summaries/legacy/CLOUDFLARE_INDEX.md 2>/dev/null || mv CLOUDFLARE_INDEX.md docs/summaries/legacy/CLOUDFLARE_INDEX.md
git mv CLOUDFLARE_README.md docs/summaries/legacy/CLOUDFLARE_README.md 2>/dev/null || mv CLOUDFLARE_README.md docs/summaries/legacy/CLOUDFLARE_README.md
git mv 00_README_CLOUDFLARE_SETUP.md docs/summaries/legacy/00_README_CLOUDFLARE_SETUP.md 2>/dev/null || mv 00_README_CLOUDFLARE_SETUP.md docs/summaries/legacy/00_README_CLOUDFLARE_SETUP.md

echo "✅ Documentation organization complete!"
echo ""
echo "📊 Summary:"
echo "  - Cloudflare docs → docs/deployment/cloudflare/"
echo "  - R2 docs → docs/deployment/r2-storage/"
echo "  - Setup docs → docs/setup/"
echo "  - Feature docs → docs/features/"
echo "  - Changelog → docs/changelog/"
echo "  - Summaries → docs/summaries/"
echo "  - Testing → docs/testing/"
echo ""
echo "🔄 Next steps:"
echo "  1. Review changes: git status"
echo "  2. Commit: git commit -m 'docs: Reorganize documentation into structured folders'"
echo "  3. Push: git push origin main"
