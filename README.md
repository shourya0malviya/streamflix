# StreamFlix 🎬

A **Netflix-inspired streaming platform UI** built for **educational / local development practice**.

> ⚠️ **Disclaimer:** This is an original project for learning only. It is **not affiliated with Netflix**, and it contains **no Netflix code, logos, images, or copyrighted assets**. All titles are fictional, and all images are royalty-free placeholders from [picsum.photos](https://picsum.photos).

---

## Tech Stack

| Layer     | Technology                  |
|-----------|-----------------------------|
| Frontend  | React 18 + Vite 5, plain CSS, React Router 6 |
| Backend   | Node.js + Express 4         |
| Database  | Local JSON file (`server/data/movies.json`) |
| Images    | picsum.photos placeholder URLs (royalty-free) |
| Package manager | npm                   |

## Folder Structure

```
streamflix/
├── client/                      # React frontend (Vite)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js           # /api proxy -> localhost:5000
│   └── src/
│       ├── components/          # Navbar, Hero, Row, MovieCard,
│       │                        # MovieModal, Player, Footer
│       ├── pages/               # Home, Browse (Movies/TV), MyList, Search
│       ├── context/             # StoreContext (data + My List + modal)
│       ├── data/                # helpers.js (filters, image URLs)
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
├── server/                      # Express backend
│   ├── data/
│   │   └── movies.json          # 32 fictional titles
│   ├── server.js
│   └── package.json
├── package.json                 # root: one-command dev via concurrently
└── README.md
```

---

## Setup (VS Code)

**Requirements:** Node.js 18+ and npm. Check with `node -v` and `npm -v`.

Open the `streamflix` folder in VS Code, then in the integrated terminal:

### Option A — one terminal (recommended)

```bash
npm run install:all
npm run dev
```

This installs the root, server, and client dependencies, then starts **both** servers together.

### Option B — two terminals

Terminal 1 (backend):

```bash
cd server
npm install
npm run dev
```

Terminal 2 (frontend):

```bash
cd client
npm install
npm run dev
```

---

## Localhost URLs

| Service        | URL                                        |
|----------------|--------------------------------------------|
| Frontend (Vite)| **http://localhost:5173**                  |
| Backend (API)  | **http://localhost:5000**                  |
| API check      | http://localhost:5000/api/health           |
| All movies     | http://localhost:5000/api/movies           |
| One movie      | http://localhost:5000/api/movies/4         |
| Categories     | http://localhost:5000/api/categories       |

## API Endpoints

| Endpoint            | Description                                        |
|---------------------|----------------------------------------------------|
| `GET /api/movies`   | All titles. Optional: `?type=tv`, `?genre=Action`, `?search=neon` |
| `GET /api/movies/:id` | Single title by id (404 if unknown)              |
| `GET /api/categories` | Row definitions rendered on the home page        |

## Environment Variables

None required. Optional overrides:

- `PORT` — backend port (default `5000`). Example: `$env:PORT=5001; npm run dev` (PowerShell). If you change it, also update the proxy target in `client/vite.config.js`.

## Features

- Navbar with Home / Movies / TV Shows / My List, expanding search, profile dropdown, scroll-aware background
- Cinematic hero with featured title, gradient overlays, Play + More Info
- 9 horizontal scroll rows (Trending, Popular Movies/TV, Action, Comedy, Sci-Fi, Thriller, New Releases, Recommended For You)
- Hover-animated cards with year, rating, genre, and **+ My List**
- Details modal: backdrop, description, rating, year, duration, Play, Add to My List (Esc / ✕ / backdrop-click to close)
- Working client-side search (title + genre)
- **My List** persisted in `localStorage` (key `streamflix-my-list`)
- Fake fullscreen player with animated progress bar (demo — no real video)
- Responsive: desktop / laptop / tablet / mobile (hamburger menu below 768px)
- Loading spinner, fade/zoom/pulse animations, `prefers-reduced-motion` respected

## Troubleshooting

1. **"Can't reach the StreamFlix API" banner in the browser**
   The backend isn't running. Start it: `cd server && npm run dev`, then refresh. The frontend calls `/api/...`, which Vite proxies to `localhost:5000`.

2. **Port already in use (EADDRINUSE)**
   Another process owns 5000/5173. Either kill it (`npx kill-port 5000`) or set `PORT` as above and update `vite.config.js`.

3. **Images don't load / posters show gray gradients**
   Posters come from picsum.photos — an internet connection is needed for images. Without internet you'll see styled gradient placeholders with the title text (the app still works). You can swap the URLs in `client/src/data/helpers.js` for any local images.

4. **`npm run dev` on the root prints errors**
   Run `npm run install:all` first. Make sure you opened the terminal inside the `streamflix` folder.

5. **Search page shows nothing**
   Type in the navbar search box (click 🔍 first). Results appear at `/search?q=...` filtering titles and genres.

6. **My List disappeared**
   It lives in `localStorage` — clearing browser data/site data removes it. Using a different browser or port also gives a fresh list.

7. **Node/npm version errors**
   Use Node 18 or newer (`node -v`). Vite 5 requires Node ≥18.

8. **Editing the data**
   Edit `server/data/movies.json` and restart the backend (data loads at startup).

9. **Windows PowerShell note**
   This project was built and verified with PowerShell 5.1 — all commands above are cross-platform (`cd`, `npm`). No `.env` file is needed.

10. **Resetting everything**
    Delete `client/node_modules`, `server/node_modules` and `node_modules`, then re-run `npm run install:all`.

---

Made for learning. Enjoy! 🍿