// Cloudflare R2 Download URLs Configuration
// 
// This file centralizes all download URLs for books and artifacts.
// Replace these placeholder URLs with actual R2 bucket URLs when ready.
//
// R2 Bucket Setup:
// 1. Create a Cloudflare R2 bucket
// 2. Upload book PDFs and artifact files
// 3. Set up public access or signed URLs
// 4. Update the URLs below
//
// Example R2 public URL: https://pub-{hash}.r2.dev
// Example custom domain: https://files.theforensicbrief.com

export const R2_BASE_URL = 'https://files.theforensicbrief.com';

export const BOOK_URLS = {
  'human-in-control': {
    cover: `${R2_BASE_URL}/books/human-in-control-front-cover.jpg`,
    backCover: `${R2_BASE_URL}/books/human-in-control-back-cover.jpg`,
    pdf: `${R2_BASE_URL}/books/human-in-control.pdf`,
  },
} as const;

export const ARTIFACT_URLS = {
  'decision-envelope': {
    pdf: `${R2_BASE_URL}/artifacts/decision-envelope-v1.pdf`,
    docx: `${R2_BASE_URL}/artifacts/decision-envelope-v1.docx`,
  },
  'mris-template': {
    pdf: `${R2_BASE_URL}/artifacts/mris-template-v1.pdf`,
    docx: `${R2_BASE_URL}/artifacts/mris-template-v1.docx`,
    xlsx: `${R2_BASE_URL}/artifacts/mris-template-v1.xlsx`,
  },
} as const;
