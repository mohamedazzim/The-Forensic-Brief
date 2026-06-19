# Cloudflare Pages Deployment Guide

## Prerequisites

- Cloudflare account (free tier is sufficient)
- GitHub repository connected to Cloudflare Pages

## Build Configuration

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Output directory | `dist` |
| Framework preset | Astro |
| Node.js version | 20 |

## Step-by-Step Deployment

### 1. Connect Repository

1. Log in to Cloudflare Dashboard
2. Go to **Workers & Pages** > **Create**
3. Select **Pages** tab
4. Click **Connect to Git**
5. Select your GitHub repository
6. Click **Begin setup**

### 2. Configure Build Settings

1. **Project name:** `the-forensic-brief`
2. **Production branch:** `main` (or `master`)
3. **Build command:** `npm run build`
4. **Build output directory:** `dist`
5. **Node.js version:** `20` (in Environment Variables)

### 3. Set Environment Variables

Add these in **Settings** > **Environment variables**:

| Variable | Value |
|----------|-------|
| `NODE_VERSION` | `20` |

### 4. Deploy

1. Click **Save and Deploy**
2. Wait for build to complete (~2-3 minutes)
3. Note the preview URL (e.g., `https://the-forensic-brief.pages.dev`)

### 5. Custom Domain (Optional)

1. Go to **Custom domains** tab
2. Click **Set up a custom domain**
3. Enter `theforensicbrief.com`
4. Follow DNS configuration instructions
5. Wait for SSL certificate provisioning

## Build Verification

After deployment, verify:

- [ ] Site loads at preview URL
- [ ] All pages render correctly
- [ ] Search works (Pagefind)
- [ ] RSS feed accessible at `/rss.xml`
- [ ] Sitemap accessible at `/sitemap-index.xml`
- [ ] robots.txt accessible at `/robots.txt`

## Troubleshooting

### Build Fails

- Check Node.js version is set to 20
- Verify `npm run build` works locally
- Check build logs for specific errors

### Pages Not Found

- Verify output directory is `dist`
- Check that all routes are generated correctly

### CSS Not Loading

- Clear Cloudflare cache
- Verify CSS files are in `dist/_astro/`

## Cost

Cloudflare Pages free tier includes:
- Unlimited bandwidth
- Unlimited requests
- 500 builds per month
- Preview deployments per branch
