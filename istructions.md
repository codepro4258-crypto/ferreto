# Ferretto Quick Instructions

## 1) Run the app locally
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build production bundle: `npm run build`

## 2) Run the phase-1 audit
- Command: `npm run audit:phase1`
- Output report: `phase1-audit-report.json`

## 3) If you see "Failed to save data"
This is usually a browser storage limit issue (localStorage quota).
The app now auto-recovers by:
- trimming old system logs,
- trimming extremely large project/material content,
- retrying save automatically.

If warning still appears repeatedly:
1. Export important data first.
2. Delete unused large materials/projects.
3. Clear browser site storage for this app and log in again.

## 4) Recommended operational checks
- Syntax check main app: `node --check app.js`
- Audit script check: `node --check scripts/phase1-audit.mjs`
- Run audit: `npm run audit:phase1`
