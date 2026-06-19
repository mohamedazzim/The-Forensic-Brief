# Cloudflare R2 Setup Guide

## Overview

R2 stores large binary files (book PDFs, artifact downloads, cover images) outside the Git repository. This keeps the repo lightweight and provides zero-egress file delivery.

## Prerequisites

- Cloudflare account (free tier includes 10 GB storage)
- R2 enabled in Cloudflare Dashboard

## Step-by-Step Setup

### 1. Create R2 Bucket

1. Log in to Cloudflare Dashboard
2. Go to **R2** > **Create bucket**
3. Enter bucket name: `theforensicbrief`
4. Select location: **Automatic** (or closest to your audience)
5. Click **Create bucket**

### 2. Enable Public Access

1. Go to your bucket settings
2. Click **Settings** tab
3. Under **Public access**, click **Allow Access**
4. Note the public URL (e.g., `https://pub-{hash}.r2.dev`)

### 3. Create Folder Structure

Create these folders in your R2 bucket:

```
books/
  human-in-control-cover.jpg
  human-in-control.pdf
  out-of-bounds-cover.jpg
  out-of-bounds.pdf
  accountable-autonomy-cover.jpg
  accountable-autonomy.pdf
  six-dimensions-cover.jpg
  six-dimensions.pdf
  the-burden-cover.jpg
  the-burden.pdf
artifacts/
  decision-envelope-v1.pdf
  decision-envelope-v1.docx
  mris-template-v1.pdf
  mris-template-v1.docx
  mris-template-v1.xlsx
```

### 4. Upload Files

Upload your actual files to the corresponding folders.

### 5. Update Download Configuration

Edit `src/config/downloads.ts`:

```typescript
export const R2_BASE_URL = 'https://pub-YOUR_HASH.r2.dev';

// Or use a custom domain:
// export const R2_BASE_URL = 'https://files.theforensicbrief.com';
```

### 6. Redeploy

After updating the URLs, redeploy to Cloudflare Pages:

```bash
git push origin main
```

## Required Files

### Books

| File | Path | Content |
|------|------|---------|
| human-in-control-cover.jpg | `books/` | Book cover image |
| human-in-control.pdf | `books/` | Full book PDF |
| (repeat for each book) | | |

### Artifacts

| File | Path | Content |
|------|------|---------|
| decision-envelope-v1.pdf | `artifacts/` | Decision Envelope template |
| decision-envelope-v1.docx | `artifacts/` | Word version |
| mris-template-v1.pdf | `artifacts/` | MRIS template |
| mris-template-v1.docx | `artifacts/` | Word version |
| mris-template-v1.xlsx | `artifacts/` | Excel version |

## Cost

R2 free tier includes:
- 10 GB storage
- 10 million Class A operations (writes)
- 10 million Class B operations (reads)
- Zero egress fees

## Security

- Public access is required for file downloads
- Consider signed URLs for sensitive content
- Enable CORS if needed for cross-origin requests
