# CSS Positioning

## Centered Content with Flexbox

When using flexbox for centering content, to move centered content to the bottom:

### Problem
Adding `margin-top` to centered flex items doesn't work well because `align-items: center` keeps forcing the content to the vertical center.

### Solution
Change the flex alignment approach:

```css
/* Before: Centered */
.hero {
  display: flex;
  align-items: center;  /* Forces vertical center */
  justify-content: center;
}

/* After: Bottom positioned with padding */
.hero {
  display: flex;
  align-items: flex-end;     /* Align to bottom */
  justify-content: center;   /* Keep horizontal center */
  padding-bottom: 15vh;      /* Add space from bottom */
}
```

### Key Points
- `align-items: flex-end` aligns flex children to the bottom edge
- `padding-bottom` creates space from the viewport bottom
- This is more reliable than `margin-top` on flex items when dealing with viewport-height containers
- Adjust `padding-bottom` value (e.g., 15vh, 20vh) to fine-tune position

### Example Values for Positioning
- `padding-bottom: 10vh` - Near bottom
- `padding-bottom: 15vh` - Lower third area (good for hand/body placement)
- `padding-bottom: 25vh` - Above bottom, still low

# Workflow
- After making project changes, run `npm run build` to verify the build passes. Confidence: 0.70
- Report format: list files changed, commands run, build result, and remaining gaps/next steps after each phase of work. Confidence: 0.70

# Astro
- Self-host fonts locally in `public/fonts/` using `@font-face` declarations; never use Google Fonts CDN or any external font CDN. Confidence: 0.85
- Preserve the warm parchment/old bond sheet aesthetic: `--bg: #f0ebe2`, `--bg-card: #faf7f2`, `--text-primary: #1a2535`, `--border: #c8c0b4`, vertical lined-paper background with 32px spacing. Do not add automatic dark themes that change these values. Confidence: 0.90
- Keep article pages with zero JavaScript unless required. Confidence: 0.70
- Keep project configured for static output mode (`output: "static"`). Confidence: 0.70

# Git
- Use user's actual name and email for git config (`mohamedazzim` / `azzimandabdullah1@gmail.com`); do not use placeholder or assistant-generated credentials. Confidence: 0.65

# Design System

## Background and Aesthetic

The application uses a warm parchment/old bond sheet aesthetic:
- Background color: `#f0ebe2` (warm cream/off-white)
- Card background: `#faf7f2` (slightly lighter)
- Text: `#1a2535` (near-black ink)
- Borders: muted warm browns (`#c8c0b4`, `#ddd8d0`)
- Vertical lined-paper effect via `repeating-linear-gradient` with 32px spacing in semi-transparent warm gray
- Editorial/serif typography (Lora, Playfair Display fonts)
- This "old bond sheet" look is the core visual identity of the application. Do not add automatic dark themes that change these background/color values.

## React Component Structure

For hero sections with video backgrounds:

```tsx
<div className={styles.hero}>
  {/* Background video layer */}
  <div className={styles.videoContainer}>...</div>
  
  {/* Content layer - positioned via flexbox */}
  <div className={styles.content}>
    <h1>Name</h1>
    <p>Subtitle</p>
  </div>
</div>
```

The `.content` element inherits positioning from parent's flexbox alignment.
