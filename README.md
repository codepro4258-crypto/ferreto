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

If you want to use **Google Sheets as your database**, follow this exact setup. After this, data created by one user/device (for example in India) will sync to other users/devices (for example in the US).

### How it works in this project

- Your app keeps a local copy in `localStorage` for fast UI.
- When Google Sheets Web App URL is configured, app also:
  - loads cloud data on startup,
  - saves cloud data after changes,
  - polls cloud every ~8 seconds for newer data.
- A timestamp (`updatedAt` / `metadata.lastUpdatedAt`) is used so newer cloud data can be applied safely.

### Step-by-step setup (recommended)

1. Create a new Google Sheet (name it something like `FerrettoDB`).
2. Open that sheet and go to **Extensions → Apps Script**.
3. Delete any default code in `Code.gs`.
4. Paste this script:

```javascript
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || '';
  const props = PropertiesService.getScriptProperties();
  const raw = props.getProperty('FERRETTO_DATA') || '{}';
  const updatedAt = props.getProperty('FERRETTO_UPDATED_AT') || '';
  const data = JSON.parse(raw);

  if (action === 'load') {
    return ContentService
      .createTextOutput(JSON.stringify({ data, updatedAt }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');

  if (body.action === 'save' && body.data) {
    PropertiesService.getScriptProperties().setProperty(
      'FERRETTO_DATA',
      JSON.stringify(body.data)
    );

    PropertiesService.getScriptProperties().setProperty(
      'FERRETTO_UPDATED_AT',
      body.updatedAt || new Date().toISOString()
    );

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: false, error: 'Invalid payload' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

5. Click **Deploy → New deployment**.
6. Choose type **Web app**.
7. Set:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone with the link`
8. Click **Deploy** and authorize permissions.
9. Copy the Web App URL (it looks like `https://script.google.com/macros/s/.../exec`).

### Connect the URL to this app

Use either option below.

#### Option A: Hardcode in `index.html` (best for shared deployment)

Add this before loading `app.js`:

```html
<script>
window.FERRETTO_GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/DEPLOYMENT_ID/exec";
</script>
```

#### Option B: Set from browser console (quick testing)

```js
localStorage.setItem('ferretto_google_sheets_web_app_url', 'https://script.google.com/macros/s/DEPLOYMENT_ID/exec');
location.reload();
```

### Verify it is working

1. Open app in Browser A (e.g., India location/VPN).
2. Login as admin and create a new user.
3. Open app in Browser B (e.g., US location/VPN) with same configured URL.
4. Wait a few seconds (poll interval ~8s) and refresh dashboard if needed.
5. The newly created user should appear.

### Troubleshooting

- **Data is not syncing**
  - Ensure deployment access is `Anyone with the link`.
  - Ensure URL ends with `/exec` (not `/dev`).
  - Confirm the URL is set in `index.html` or `localStorage`.

- **Old data appears**
  - Redeploy Apps Script after code changes.
  - Clear browser storage and reload once.

- **CORS / fetch errors**
  - Re-deploy Web App and confirm correct permissions.

### Live updates across countries (India ↔ US)

- IDs and records created in one country are saved to Google Apps Script storage.
- Other logged-in clients poll for newer timestamped data and auto-load it.
- This gives near-live shared access without running your own backend server.

## Project Structure

- `index.html` — Application markup and UI sections
- `styles.css` — Styling, layout, and responsive behavior
- `app.js` — Client-side logic and interactions + cloud sync
- `vite.config.ts` — Vite configuration

## Notes

- Face recognition support references `face-api.js` via CDN in `index.html`.
