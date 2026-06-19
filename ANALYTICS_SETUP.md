# Analytics Setup Guide

## Overview

The Forensic Brief uses Cloudflare Web Analytics for privacy-friendly, cookieless analytics. No invasive tracking or cookies are used.

## Cloudflare Web Analytics

### Why Cloudflare Web Analytics

- **Free** with Cloudflare account
- **No cookies** required
- **Privacy-friendly** - no personal data collected
- **No cookie consent banner** needed
- **Fast** - lightweight script

### Setup Steps

#### 1. Enable Web Analytics

1. Log in to Cloudflare Dashboard
2. Go to **Analytics & Logs** > **Web Analytics**
3. Click **Enable Cloudflare Web Analytics**
4. Select your domain: `theforensicbrief.com`
5. Copy the **token** from the script tag

#### 2. Update Analytics Component

Edit `src/components/Analytics.astro`:

Find this section:
```html
<!--
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' 
  data-cf-beacon='{"token": "YOUR_TOKEN_HERE"}'></script>
-->
```

Replace `YOUR_TOKEN_HERE` with your actual token and remove the comment tags:
```html
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' 
  data-cf-beacon='{"token": "your-actual-token"}'></script>
```

#### 3. Redeploy

```bash
git push origin main
```

### Verification

1. Deploy the site
2. Visit a few pages
3. Wait 5-10 minutes
4. Check Cloudflare Dashboard > **Analytics & Logs** > **Web Analytics**
5. Verify page views are being recorded

## Custom Event Tracking

The `Analytics` component includes a placeholder for custom event tracking:

```javascript
window.trackEvent = (eventName, properties) => {
  // In development, logs to console
  // In production, send to your analytics endpoint
};
```

To track events (e.g., downloads, newsletter signups):

```javascript
// Track a download
window.trackEvent('download', { 
  file: 'human-in-control.pdf',
  type: 'book' 
});

// Track a newsletter signup
window.trackEvent('newsletter_signup', { 
  source: 'homepage' 
});
```

## Privacy

- No cookies are set
- No personal data is collected
- No cross-site tracking
- No third-party data sharing
- Complies with GDPR without cookie consent

## Cost

Cloudflare Web Analytics is free with any Cloudflare plan.

## Alternative: Cloudflare Pages Built-in Analytics

Cloudflare Pages includes basic analytics automatically. You can view them in:
- Cloudflare Dashboard > **Workers & Pages** > your project > **Analytics**

This requires no additional setup.
