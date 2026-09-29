// Shared helpers: image URLs and category filtering.
//
// Images: royalty-free placeholder photos from picsum.photos, keyed by a
// stable "seed" so every title always gets the same picture. If picsum is
// unreachable the <img> onError handler hides the image and a styled
// gradient fallback with the title text shows instead (see MovieCard).

export function posterUrl(movie) {
  return `https://picsum.photos/seed/${encodeURIComponent(movie.seed)}/342/513`;
}

export function backdropUrl(movie, width = 1280) {
  const height = Math.round((width * 9) / 16);
  return `https://picsum.photos/seed/${encodeURIComponent(movie.seed)}/${width}/${height}`;
}

/**
 * Apply a category filter object (from GET /api/categories) to a movie list.
 * Supported filter keys: trending, isNew, type, genre, sort, recommended.
 * The client does the filtering so rows update instantly with no extra requests.
 */
export function applyFilter(movies, filter = {}) {
  let result = movies;

  if (filter.type) {
    result = result.filter((m) => m.type === filter.type);
  }
  if (filter.genre) {
    const g = filter.genre.toLowerCase();
    result = result.filter((m) => m.genres.some((name) => name.toLowerCase() === g));
  }
  if (filter.trending) {
    result = result.filter((m) => m.trending);
  }
  if (filter.isNew) {
    result = result.filter((m) => m.isNew);
  }
  if (filter.sort === 'rating') {
    result = [...result].sort((a, b) => b.rating - a.rating);
  }
  if (filter.recommended) {
    // Deterministic pseudo-shuffle so it feels personal but stays stable
    // across re-renders (no Math.random flicker).
    result = [...result].sort(
      (a, b) => ((a.id * 7919) % 97) - ((b.id * 7919) % 97)
    );
    result = result.slice(0, 12);
  }

  return result;
}

// Client-side search across title and genres.
export function searchMovies(movies, query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return movies.filter(
    (m) =>
      m.title.toLowerCase().includes(q) ||
      m.genres.some((g) => g.toLowerCase().includes(q))
  );
}