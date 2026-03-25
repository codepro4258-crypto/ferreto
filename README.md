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

## Google Sheets + OAuth 2.0 Cloud Sync

The app supports secure Google Sheets synchronization with OAuth 2.0 (Authorization Code + PKCE) so cloud access tokens are short-lived and refreshable.

### Required runtime configuration

Add these globals in `index.html` (or inject from your deployment template):

```html
<script>
window.FERRETTO_GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/DEPLOYMENT_ID/exec";
window.FERRETTO_GOOGLE_OAUTH_CLIENT_ID = "YOUR_GOOGLE_OAUTH_CLIENT_ID";
window.FERRETTO_GOOGLE_OAUTH_REDIRECT_URI = "https://YOUR_APP/callback";
window.FERRETTO_GOOGLE_OAUTH_TOKEN_PROXY_URL = "https://YOUR_BACKEND/api/google/oauth/token";
</script>
```

### Security model

- The browser never stores a Google client secret.
- Code/token exchange happens via `FERRETTO_GOOGLE_OAUTH_TOKEN_PROXY_URL` on your backend.
- Access token + refresh token are cached locally and automatically refreshed.
- The app sends `Authorization: Bearer <token>` headers for cloud read/write calls.

### Data reliability improvements

- Automatic duplicate cleanup for users, courses, projects, groups, materials, chat, and attendance.
- Relationship repair (invalid foreign keys are dropped or normalized).
- Conflict-aware merge strategy using the newest `updatedAt`/`createdAt` record.
- Scheduled cloud pull sync (default every 60s) plus debounced push sync on writes.
- Structured cloud sync logging and improved error handling with safe local fallback.

## Project Structure

- `index.html` — Application markup and UI sections
- `styles.css` — Styling, layout, and responsive behavior
- `app.js` — Client-side logic and interactions + cloud sync
- `vite.config.ts` — Vite configuration

## Notes

- Face recognition support references `face-api.js` via CDN in `index.html`.
