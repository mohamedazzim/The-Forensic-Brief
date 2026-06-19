# Launch Checklist

## Pre-Launch Verification

### Build & Technical

- [ ] `npm run build` completes with 0 errors
- [ ] `dist/` directory contains all expected files
- [ ] No server-side code in the build
- [ ] No external API calls at build time
- [ ] Static output only

### Content & Pages

- [ ] Home page renders correctly
- [ ] All incident pages render
- [ ] All essay pages render
- [ ] All book pages render
- [ ] All artifact pages render
- [ ] All observation pages render
- [ ] All topic pages render
- [ ] About page renders
- [ ] Methodology page renders
- [ ] Disclaimer page renders
- [ ] 404 page renders

### SEO & Discovery

- [ ] `sitemap-index.xml` exists and is valid
- [ ] `rss.xml` exists and is valid
- [ ] `robots.txt` exists and is correct
- [ ] All pages have `<title>` tags
- [ ] All pages have meta descriptions
- [ ] Canonical URLs are self-referencing
- [ ] Open Graph tags present (placeholder OK)

### Search

- [ ] Pagefind index generated in `dist/pagefind/`
- [ ] Search box on homepage
- [ ] Search returns relevant results
- [ ] Search is keyboard accessible

### Design & Accessibility

- [ ] Old bond-sheet background preserved:
  - `--bg: #f0ebe2`
  - `--bg-card: #faf7f2`
  - `--text-primary: #1a2535`
  - `--border: #c8c0b4`
  - `--line-gap: 32px`
- [ ] No Google Fonts CDN references
- [ ] No automatic dark theme
- [ ] Skip-to-content link works
- [ ] Focus states visible
- [ ] Keyboard navigation works
- [ ] Mobile responsive
- [ ] WCAG 2.2 AA contrast ratios

### Security & Privacy

- [ ] No fake credentials in code
- [ ] No API keys committed
- [ ] No sensitive data in repository
- [ ] HTTPS enforced
- [ ] No cookies (except analytics if enabled)
- [ ] Privacy policy link in footer

### Placeholders

- [ ] OG images clearly marked as placeholder
- [ ] PDF viewer clearly marked as placeholder
- [ ] Analytics clearly marked as placeholder
- [ ] Newsletter form clearly marked as placeholder
- [ ] R2 download URLs clearly marked as placeholder

## Deployment

### Cloudflare Pages

- [ ] Repository connected to Cloudflare Pages
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Node.js version: 20
- [ ] Environment variables set
- [ ] Build succeeds on Cloudflare
- [ ] Preview URL works

### Custom Domain (Optional)

- [ ] DNS configured for theforensicbrief.com
- [ ] SSL certificate provisioned
- [ ] Redirects configured (www → apex or vice versa)

### Cloudflare R2 (When Ready)

- [ ] R2 bucket created
- [ ] Files uploaded to correct paths
- [ ] Public access enabled
- [ ] `src/config/downloads.ts` updated with real URLs
- [ ] Redeploy after URL update

### Newsletter (When Ready)

- [ ] Provider account created
- [ ] Form endpoint obtained
- [ ] `NewsletterCTA.astro` updated with real endpoint
- [ ] Redeploy after update

### Analytics (When Ready)

- [ ] Cloudflare Web Analytics enabled
- [ ] Token obtained
- [ ] `Analytics.astro` updated with real token
- [ ] Redeploy after update

### Fonts (When Ready)

- [ ] .woff2 files downloaded
- [ ] Files placed in `public/fonts/`
- [ ] @font-face declarations uncommented
- [ ] Redeploy after update

## Post-Launch

- [ ] Verify site loads on custom domain
- [ ] Test all navigation links
- [ ] Test search functionality
- [ ] Test newsletter signup (when wired)
- [ ] Monitor Cloudflare Analytics
- [ ] Check Core Web Vitals
- [ ] Verify RSS feed works in feed readers
- [ ] Submit sitemap to Google Search Console

## Rollback Plan

If issues occur:
1. Check Cloudflare Pages build logs
2. Verify `npm run build` works locally
3. Roll back to previous commit if needed
4. Test in preview deployment before promoting to production
