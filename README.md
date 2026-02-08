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

Because this project currently does not define `scripts` in `package.json`, start Vite directly:

```bash
npx vite
```

Then open the local URL shown in the terminal (usually `http://localhost:5173`).

### Build for production

```bash
npx vite build
```

## Project Structure

- `index.html` — Application markup and UI sections
- `styles.css` — Styling, layout, and responsive behavior
- `app.js` — Client-side logic and interactions
- `vite.config.ts` — Vite configuration

## Notes

- Face recognition support references `face-api.js` via CDN in `index.html`.
- This repository currently includes a committed `node_modules/` directory.
