# Cloudflare Pages GitHub Integration Setup Guide

## ✅ Configuration Fixed

Your wrangler configuration files have been updated to be compatible with Cloudflare Pages deployment via GitHub integration.

### Files Updated

1. **[wrangler.toml](wrangler.toml)** - Simplified Pages-compatible configuration
2. **[wrangler.json](wrangler.json)** - Minimal Pages configuration
3. **[.nvmrc](.nvmrc)** - Node.js version specification (Node 20)
4. **[wrangler.workers.toml](wrangler.workers.toml)** - NEW: Separate Workers config for R2 cache

---

## 🚀 Next Steps: Connect GitHub to Cloudflare Pages

### Step 1: Push Changes to GitHub

```bash
git add .
git commit -m "fix: Update wrangler config for Cloudflare Pages compatibility"
git push origin main
```

### Step 2: Set Up Cloudflare Pages Project

1. **Go to Cloudflare Dashboard**
   - Navigate to: https://dash.cloudflare.com/
   - Select your account: `031ca9685557ca09a945ef3d0ba54f8e`
   - Click **Workers & Pages** in the sidebar

2. **Create Pages Project**
   - Click **Create application**
   - Select **Pages** tab
   - Click **Connect to Git**

3. **Connect GitHub Repository**
   - Click **Connect GitHub**
   - Authorize Cloudflare to access your GitHub account
   - Select repository: `LakishaDev/vaga-beta-react`
   - Click **Begin setup**

### Step 3: Configure Build Settings

In the **Set up builds and deployments** section:

| Setting                    | Value                  |
| -------------------------- | ---------------------- |
| **Project name**           | `vaga-beta`            |
| **Production branch**      | `main`                 |
| **Framework preset**       | `Vite` (auto-detected) |
| **Build command**          | `npm run build:prod`   |
| **Build output directory** | `dist`                 |
| **Root directory**         | (leave empty or `/`)   |
| **Environment variables**  | (see below if needed)  |

### Step 4: Environment Variables (Optional)

If your app needs Firebase or other environment variables during build:

Click **Add variable** and add:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

> **Note**: Get these values from your [Firebase Console](https://console.firebase.google.com/)

### Step 5: Deploy!

1. Click **Save and Deploy**
2. Cloudflare Pages will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Run build command (`npm run build:prod`)
   - Deploy to global CDN

3. First deployment takes ~2-5 minutes

### Step 6: Custom Domain Setup

Once deployed, add your custom domain `vagabeta.rs`:

1. In Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `vagabeta.rs` and `www.vagabeta.rs`
4. Cloudflare will automatically configure DNS (if domain is in same account)
5. Free SSL certificate is auto-provisioned

---

## 📋 What Changed in Configuration

### Before (Workers Config) ❌

- `main = "src/workers/r2-cache-worker.js"` - Workers entry point
- `routes = [...]` - Workers routing (not supported in Pages)
- `[build]` section - Build commands (Pages uses Dashboard settings)
- Durable Objects binding - Workers feature
- Mixed Pages + Workers configuration

### After (Pages Config) ✅

- `name = "vaga-beta"` - Top-level project name (required)
- `pages_build_output_dir = "dist"` - Output directory
- `compatibility_date = "2024-01-01"` - API compatibility
- Build settings configured in Cloudflare Dashboard
- Clean separation: Pages app vs Workers (R2 cache)

---

## 🔧 Deploying R2 Cache Worker (Optional)

If you need the R2 cache worker for CDN functionality:

```bash
# Deploy R2 worker separately
wrangler deploy --config wrangler.workers.toml

# This deploys to routes:
# - https://cache.vagabeta.rs/*
# - https://cdn.vagabeta.rs/*
```

**Prerequisites:**

- R2 buckets created: `vaga-beta-cache`, `vaga-beta-cdn`
- KV namespace created with ID: `2bb2f5778aaa459382c4731b60f3405a`
- DNS records for `cache.vagabeta.rs` and `cdn.vagabeta.rs`

---

## 🎯 Automatic Deployments

Once GitHub is connected:

✅ **Production Deploys**: Every push to `main` branch  
✅ **Preview Deploys**: Every pull request gets a preview URL  
✅ **Instant Rollbacks**: Redeploy any previous deployment with one click  
✅ **Build Logs**: Full visibility into build process

---

## 🔍 Verification Checklist

After deployment, verify:

- [ ] Site loads at `https://vaga-beta.pages.dev`
- [ ] Site loads at `https://vagabeta.rs` (after custom domain setup)
- [ ] All routes work correctly (React Router)
- [ ] Firebase authentication works
- [ ] Images and assets load properly
- [ ] No console errors in browser
- [ ] Build time is acceptable (~2-5 min)

---

## 🆘 Troubleshooting

### Build Fails

**Check build logs** in Cloudflare Pages dashboard:

- Look for npm install errors (dependency issues)
- Look for build command errors (linting, compilation)
- Verify Node version (should use Node 20 from `.nvmrc`)

### 404 on Routes

If React Router routes show 404:

- Cloudflare Pages auto-configures for Vite SPAs
- Check that `dist/_redirects` file is created (Vite should generate it)
- Or ensure `public/_redirects` contains:
  ```
  /* /index.html 200
  ```

### Environment Variables Not Working

- Variables must be prefixed with `VITE_` to be exposed to browser
- Rebuild after adding variables (env vars are build-time, not runtime)
- Check variable names match exactly (case-sensitive)

---

## 📚 Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Vite + Pages Guide](https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite3-project/)
- [Custom Domains](https://developers.cloudflare.com/pages/platform/custom-domains/)
- [Preview Deployments](https://developers.cloudflare.com/pages/platform/preview-deployments/)

---

## 🎉 Summary

Your project is now configured for:

- **Cloudflare Pages** - React app deployment via GitHub
- **Automatic deployments** - Every push triggers a build
- **Separate Workers deployment** - R2 cache worker can be deployed independently
- **Node 20** - Specified via `.nvmrc` for consistent builds

**Ready to deploy!** Push to GitHub and set up the Pages project in Cloudflare Dashboard.
