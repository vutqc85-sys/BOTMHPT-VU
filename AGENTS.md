# EFAUNT — Static Game Automation UI

## Overview
Pure static HTML/JS project (no build system, no backend, no package.json).
Vanilla JavaScript + Bootstrap 5 (via CDN) + jQuery + CryptoJS.
Data is stored in browser `localStorage`. API calls go to an external game server.

## Running
- Served via `docker-compose.base44.yml` (nginx:alpine) on host port 3000.
- `nginx.conf` runs nginx as root because the bind-mounted repo dir has 700 permissions.
- Root URL (`/`) serves `listAccount.html` as the landing page.

## Pages
- `listAccount.html` — user list (landing page)
- `registerAccount.html` — register/login form
- `user.html` — user details with automation buttons
- `servantList.html` — servant ID list
- `edit.html` — edit user info

## No secrets required
No external credentials needed to boot — the app is static HTML.
API calls to the game server use user-supplied credentials entered in the UI.
