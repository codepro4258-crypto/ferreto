# Ferretto Edu Pro

Ferretto Edu Pro is a browser-based learning management dashboard prototype with a modern single-page interface. The app includes login and role-aware dashboard views for learning workflows such as study materials, attendance, coding practice, leaderboard tracking, and group chat collaboration.

## Tech Stack

- HTML (`index.html`)
- CSS (`styles.css`)
- Vanilla JavaScript (`app.js`)
- Vite dependency available for local dev serving

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Then open the local URL shown in the terminal (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
```

## Google Sheets Cloud Database (Worldwide Shared Data)

The app now supports cloud sync using Google Sheets through a deployed Google Apps Script web app. This makes user/account changes shared globally instead of being only local browser storage.

### What changed

- Data is loaded from/saved to Google Sheets only (no local/session browser persistence for app data).
- If Google Sheets is unavailable, the app uses in-memory default data for that page session only.
- New records (including users) use global unique IDs (`crypto.randomUUID`-based when available), reducing collisions across devices.

### Setup steps

1. Create a Google Sheet.
2. Open **Extensions → Apps Script**.
3. Paste this script and deploy as a **Web app** (execute as *Me*, access *Anyone with link*):

```javascript
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || '';
  const props = PropertiesService.getScriptProperties();
  const raw = props.getProperty('FERRETTO_DATA') || '{}';
  const data = JSON.parse(raw);

  if (action === 'load') {
    return ContentService
      .createTextOutput(JSON.stringify({ data }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  if (body.action === 'save' && body.data) {
    PropertiesService.getScriptProperties().setProperty('FERRETTO_DATA', JSON.stringify(body.data));
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: false, error: 'Invalid payload' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Copy your deployed Web App URL.
5. Set it in `index.html`:

```html
<script>
window.FERRETTO_GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/DEPLOYMENT_ID/exec";
</script>
```

6. Reload the app. Data edits (users/projects/etc.) will now sync through Google and can be accessed worldwide.

> Tip: You can also set/update the URL at runtime in browser console with:
> `sessionStorage.setItem('ferretto_google_sheets_web_app_url', 'YOUR_URL')`

## Project Structure

- `index.html` — Application markup and UI sections
- `styles.css` — Styling, layout, and responsive behavior
- `app.js` — Client-side logic and interactions + cloud sync
- `vite.config.ts` — Vite configuration

## Notes

- Face recognition support references `face-api.js` via CDN in `index.html`.
