/**
 * StreamFlix API server (Express)
 * ---------------------------------
 * Serves mock movie data from data/movies.json.
 *
 * Endpoints:
 *   GET /api/health          -> { status: 'ok' }
 *   GET /api/movies          -> all movies (supports ?type=movie|tv and ?genre=Action)
 *   GET /api/movies/:id      -> a single movie
 *   GET /api/categories      -> the category rows shown on the home page
 *
 * Port: 5000 (override with the PORT environment variable)
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware -------------------------------------------------------------
// CORS is enabled so the Vite dev server (localhost:5173) can call this API
// directly if you don't use the /api proxy. The proxy is the default path.
app.use(cors());
app.use(express.json());

// --- Data loading -----------------------------------------------------------
// Movies live in a local JSON file. It is read once at startup.
// If you edit movies.json, restart the server to see changes.
const DATA_PATH = path.join(__dirname, 'data', 'movies.json');

function loadMovies() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read movies.json:', err.message);
    // Fail loudly but keep the server alive with an empty list.
    return [];
  }
}

const movies = loadMovies();

// --- Routes -----------------------------------------------------------------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', movies: movies.length });
});

// GET /api/movies — supports optional filters via query string:
//   ?type=movie|tv  -> only movies or only tv shows
//   ?genre=Action   -> only items containing that genre (case-insensitive)
//   ?search=neon    -> matches title (case-insensitive)
app.get('/api/movies', (req, res) => {
  let result = movies;
  const { type, genre, search } = req.query;

  if (type) {
    result = result.filter((m) => m.type === type);
  }
  if (genre) {
    const g = String(genre).toLowerCase();
    result = result.filter((m) =>
      m.genres.some((genreName) => genreName.toLowerCase() === g)
    );
  }
  if (search) {
    const s = String(search).toLowerCase();
    result = result.filter((m) => m.title.toLowerCase().includes(s));
  }

  res.json(result);
});

// GET /api/movies/:id — a single movie by numeric id
app.get('/api/movies/:id', (req, res) => {
  const id = Number(req.params.id);
  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return res.status(404).json({ error: `Movie with id ${req.params.id} not found` });
  }
  res.json(movie);
});

// GET /api/categories — the row definitions used by the frontend.
// Each category has a `filter` the client applies to the movie list.
app.get('/api/categories', (_req, res) => {
  res.json([
    { id: 'trending', title: 'Trending Now', filter: { trending: true } },
    { id: 'popular-movies', title: 'Popular Movies', filter: { type: 'movie', sort: 'rating' } },
    { id: 'popular-tv', title: 'Popular TV Shows', filter: { type: 'tv', sort: 'rating' } },
    { id: 'action', title: 'Action', filter: { genre: 'Action' } },
    { id: 'comedy', title: 'Comedy', filter: { genre: 'Comedy' } },
    { id: 'sci-fi', title: 'Sci-Fi', filter: { genre: 'Sci-Fi' } },
    { id: 'thriller', title: 'Thriller', filter: { genre: 'Thriller' } },
    { id: 'new-releases', title: 'New Releases', filter: { isNew: true } },
    { id: 'recommended', title: 'Recommended For You', filter: { recommended: true } }
  ]);
});

// --- 404 + error handling ---------------------------------------------------
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Central error handler so a bad request never crashes the process.
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// --- Start ------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`✅ StreamFlix API running at http://localhost:${PORT}`);
  console.log(`   Loaded ${movies.length} titles from data/movies.json`);
  console.log(`   Try: http://localhost:${PORT}/api/movies`);
});