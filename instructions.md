# Ferretto Instructions

## Configure Google Sheets as database
1. Open `index.html` and set `window.FERRETTO_GOOGLE_SHEETS_WEB_APP_URL` to your deployed Apps Script web app URL.
2. Or set at runtime from browser console:
   - `localStorage.setItem('ferretto_google_sheets_web_app_url', 'https://script.google.com/macros/s/.../exec')`
3. Reload the app.

## Save behavior
- The app saves to browser localStorage for fast local cache.
- If localStorage fails (quota/browser restriction), it now attempts saving to Google Sheets.
- If local quota is exceeded, the app auto-trims oversized logs/content and retries.

## Commands
- Start dev server: `npm run dev`
- Run audit: `npm run audit:phase1`
- Syntax check: `node --check app.js`
