# Fonts Setup Guide

## Overview

The Forensic Brief uses self-hosted fonts for performance and privacy. Currently, the site falls back to Georgia serif until woff2 font files are added.

## Required Font Files

Download these woff2 files from [Google Fonts](https://fonts.google.com/):

### Lora (Body Text)

| File | Weight | Style | Usage |
|------|--------|-------|-------|
| `Lora-Regular.woff2` | 400 | Normal | Body text |
| `Lora-Medium.woff2` | 500 | Normal | Emphasis, labels |
| `Lora-Italic.woff2` | 400 | Italic | Italic text |

### Playfair Display (Headings)

| File | Weight | Style | Usage |
|------|--------|-------|-------|
| `PlayfairDisplay-Regular.woff2` | 400 | Normal | Headings, masthead |
| `PlayfairDisplay-SemiBold.woff2` | 600 | Normal | Article titles |
| `PlayfairDisplay-Bold.woff2` | 700 | Normal | Section headings |

## Installation Steps

### 1. Download Fonts

1. Go to [Google Fonts](https://fonts.google.com/)
2. Search for **Lora**
3. Click **Download family**
4. Extract and find the woff2 files listed above
5. Repeat for **Playfair Display**

### 2. Place Files

Copy the woff2 files to:

```
public/fonts/
  Lora-Regular.woff2
  Lora-Medium.woff2
  Lora-Italic.woff2
  PlayfairDisplay-Regular.woff2
  PlayfairDisplay-SemiBold.woff2
  PlayfairDisplay-Bold.woff2
```

### 3. Activate @font-face

Edit `src/styles/typography.css`:

1. Remove the `/*` before the first `@font-face` block
2. Remove the `*/` after the last `@font-face` block
3. The file should now have uncommented @font-face declarations

**Before:**
```css
/*
@font-face {
  font-family: 'Lora';
  ...
}
*/
```

**After:**
```css
@font-face {
  font-family: 'Lora';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/Lora-Regular.woff2') format('woff2');
}
```

### 4. Verify

1. Run `npm run build`
2. Open the site in a browser
3. Check that Lora and Playfair Display load correctly
4. Verify Georgia serif is no longer used (unless fonts fail to load)

## Font Display Strategy

All @font-face declarations use `font-display: swap`:
- Text renders immediately with fallback font
- Custom font swaps in when loaded
- No invisible text during font load

## Fallback System

If woff2 files are missing or fail to load:
- Body text falls back to `Georgia, serif`
- Headings fall back to `Georgia, serif`
- No layout shift occurs

## Cost

Self-hosted fonts have no cost. The woff2 files are small:
- Lora: ~50-80 KB per weight
- Playfair Display: ~40-60 KB per weight
- Total: ~300-500 KB for all fonts

## Troubleshooting

### Fonts Not Loading

1. Verify files exist in `public/fonts/`
2. Check file names match exactly (case-sensitive)
3. Clear browser cache
4. Check browser console for 404 errors

### Wrong Font Displaying

1. Verify @font-face declarations are uncommented
2. Check font-family names match in CSS
3. Clear browser cache
