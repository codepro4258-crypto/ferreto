# Ferretto Instructions

## Configure Google Sheets as database
1. Open `index.html` and set `window.FERRETTO_GOOGLE_SHEETS_WEB_APP_URL` to your deployed Apps Script web app URL.
2. Or set at runtime from browser console:
   - `sessionStorage.setItem('ferretto_google_sheets_web_app_url', 'https://script.google.com/macros/s/.../exec')`
3. Reload the app.

## Save behavior (no localStorage)
- App data is persisted to Google Sheets only.
- If Google Sheets URL is not configured, save will fail with an explicit error toast.
- If Google Sheets is temporarily unavailable, edits cannot be persisted until connectivity is restored.

## Commands
- Start dev server: `npm run dev`
- Run audit: `npm run audit:phase1`
- Syntax check: `node --check app.js`
