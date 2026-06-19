# Cloudflare Pages Deployment

## Exact Deployment Values

### Framework Preset
- **Framework:** Astro
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `/` (repository root)

### Node.js Version
- **Node.js:** 20 (LTS)

### Environment Variables
- None required for build
- Optional: `CLOUDFLARE_ANALYTICS_TOKEN` for analytics

## Deployment Steps

### 1. Connect Repository
1. Go to Cloudflare Dashboard → Pages
2. Click "Create a project"
3. Connect your GitHub repository
4. Select the repository: `the-forensic-brief`

### 2. Configure Build Settings
```
Framework preset: Astro
Build command: npm run build
Build output directory: dist
Root directory: /
Node.js version: 20
```

### 3. Deploy
1. Click "Save and Deploy"
2. Wait for build to complete
3. Preview URL will be provided (e.g., `abc123.the-forensic-brief.pages.dev`)

### 4. Custom Domain (Optional)
1. Go to Pages project → Custom domains
2. Add `theforensicbrief.com`
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

## Build Output

The build produces:
- 31 static HTML pages
- Pagefind search index
- Sitemap (sitemap-index.xml)
- RSS feed (rss.xml)
- robots.txt

## Post-Deploy Verification

### Test URLs
- Homepage: `https://your-deployment.pages.dev/`
- Incidents: `https://your-deployment.pages.dev/incidents/`
- Essays: `https://your-deployment.pages.dev/essays/`
- Books: `https://your-deployment.pages.dev/books/`
- Artifacts: `https://your-deployment.pages.dev/artifacts/`
- Observations: `https://your-deployment.pages.dev/observations/`
- Topics: `https://your-deployment.pages.dev/topics/`
- Sitemap: `https://your-deployment.pages.dev/sitemap-index.xml`
- RSS: `https://your-deployment.pages.dev/rss.xml`
- Search: `https://your-deployment.pages.dev/`

### Checklist
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Search functionality works
- [ ] Mobile responsive
- [ ] Old bond-sheet background preserved
- [ ] No Google Fonts CDN
- [ ] No console errors

## Troubleshooting

### Build Fails
- Check Node.js version is 20
- Run `npm run build` locally to verify
- Check Cloudflare Pages build logs

### Pagefind Not Working
- Ensure `npm run build` includes Pagefind step
- Check `dist/pagefind/` directory exists

### Custom Domain Not Working
- Verify DNS records are correct
- Wait for SSL certificate provisioning
- Check Cloudflare Pages domain status

## Environment Variables (When Ready)

### Cloudflare R2
- Update `src/config/downloads.ts` with real R2 URLs
- Redeploy after update

### Newsletter
- Update `src/components/NewsletterCTA.astro` with real endpoint
- Redeploy after update

### Analytics
- Add `CLOUDFLARE_ANALYTICS_TOKEN` environment variable
- Redeploy after update

### Fonts
- Place .woff2 files in `public/fonts/`
- Uncomment @font-face in `src/styles/typography.css`
- Redeploy after update
