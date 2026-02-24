# Ferretto Quick Instructions

## 1) Run the app locally
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build production bundle: `npm run build`

## 2) Run the phase-1 audit
- Command: `npm run audit:phase1`
- Output report: `phase1-audit-report.json`

## 3) If you see "Failed to save data"
- Confirm your Google Apps Script URL is configured.
- Confirm Web App deployment uses `/exec` URL and public access.
- Open `<your-url>?action=load` and verify JSON response.

## 4) Recommended operational checks
- Syntax check main app: `node --check app.js`
- Audit script check: `node --check scripts/phase1-audit.mjs`
- Run audit: `npm run audit:phase1`
