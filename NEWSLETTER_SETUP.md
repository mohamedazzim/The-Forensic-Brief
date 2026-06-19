# Newsletter Setup Guide

## Overview

The Forensic Brief uses a provider-agnostic newsletter form. The `NewsletterCTA` component can be wired to Buttondown, ConvertKit, or any other provider that accepts form submissions.

## Recommended Providers

### Buttondown (Recommended)

- Indie-friendly, Markdown-native
- Free tier: up to 100 subscribers
- Clean embeddable forms
- Good for single-author publications

### ConvertKit (Alternative)

- Richer automation features
- Free tier: up to 1,000 subscribers
- Better for sequences and segmentation

## Setup Steps

### 1. Create Account

1. Sign up at [Buttondown](https://buttondown.com/) or [ConvertKit](https://convertkit.com/)
2. Create a new newsletter
3. Get your form endpoint URL

### 2. Get Form Endpoint

**Buttondown:**
1. Go to **Settings** > **Embeddable forms**
2. Create a new form
3. Copy the form action URL (e.g., `https://buttondown.com/api/emails/embed-subscribe/your-username`)

**ConvertKit:**
1. Go to **Landing Pages & Forms**
2. Create a new form
3. Copy the form action URL (e.g., `https://app.convertkit.com/forms/YOUR_FORM_ID/subscribe`)

### 3. Update NewsletterCTA Component

Edit `src/components/NewsletterCTA.astro`:

Find this line:
```html
<form class="newsletter-form" action="#" method="POST">
```

Replace with your provider's endpoint:
```html
<form class="newsletter-form" action="https://buttondown.com/api/emails/embed-subscribe/your-username" method="POST">
```

### 4. Add Hidden Fields (Optional)

Some providers require hidden fields. Add them inside the form:

**Buttondown:**
```html
<input type="hidden" name="redirect" value="https://theforensicbrief.com/thank-you/">
```

**ConvertKit:**
```html
<input type="hidden" name="utf8" value="✓">
<input type="hidden" name="ck_sdk_version" value="4">
```

### 5. Redeploy

```bash
git push origin main
```

## Form Behavior

The newsletter form:
- Uses `method="POST"` for secure submission
- Requires email validation (`required` attribute)
- Shows success/error states (provider handles redirect)
- No JavaScript required for basic functionality

## Styling

The form is styled to match the old bond-sheet aesthetic:
- Warm parchment background
- Serif typography (Georgia fallback)
- Subtle borders and transitions

## Cost

- Buttondown: Free up to 100 subscribers
- ConvertKit: Free up to 1,000 subscribers

## Privacy

- Double opt-in recommended
- Unsubscribe link provided by provider
- No cookies set by the form
- Privacy policy link in footer
