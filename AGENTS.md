# XZTW Bot Manager — Multi-user game bot manager

## Overview
Node.js (Express) fullstack app serving both the API and the frontend pages.
Bot automation scripts live untouched in `/auto/` and `/lib/`.
Data is persisted as JSON at `$DATA_DIR/db.json` (Docker volume `app_data`, mounted at `/data`).

## Running
- `docker compose -f docker-compose.base44.yml up -d` → http://localhost:3000
- `setup` service installs npm deps once (skips if `node_modules/express` exists)
- `app` service runs `nodemon --legacy-watch server.js` (live-reload for server code)
- Static frontend files under `public/`, `lib/`, `auto/` are served from disk — edits appear on refresh, no restart needed

## Seeded data (first boot)
- Admin account: `admin@xztw.local` / `admin1234`
- AppSettings: `gameVersion = 3.10.2`

## Auth & roles
- Email/password login (bcrypt + express-session cookies)
- First login with a new email auto-creates a UserProfile with role `viewer`
- Only `admin` can create/update/delete GameAccounts and update AppSettings
- Viewers only see GameAccounts with `visible_to_viewers = true` (read + run only)
- To promote a user to admin: edit `/data/db.json` inside the container (or the volume) and change their `role` to `admin`, then restart

## Structure
- `server/server.js` — Express app: auth, GameAccount CRUD, AppSettings, page routes
- `public/` — login (`index.html`), `dashboard.html`, `account.html` (admin config), `run.html` (bot runner)
- `public/js/settings-config.js` — the ~74 bot settings fields rendered on the account page
- `lib/`, `auto/` — original bot scripts, DO NOT modify

## Bot run flow (`/run?id={id}`)
1. Loads libs in order: pako (CDN) → /lib/crypto-js.min.js → jquery → encrypt → getToken → servants → miniEvents
2. Sets `localStorage.auths = [{username, password, server, displayName, formdata: settings}]` and `gameVersion`
3. Rewrites URL to `/run?id={id}&userIndex=0` (auto.js reads `userIndex` from the URL)
4. Loads `/auto/webBrowser.js`, `/auto/auto.js`, `/auto/autoV2.js`, `/auto/autoV3.js`
5. Buttons call the global functions defined in those scripts; logs go to `#actions` via `writeLogs()`

## Verify it works
- `curl -s http://localhost:3000/login` → login page HTML
- Login as admin, add a game account, open Run, check `#actions` shows "All scripts loaded"
