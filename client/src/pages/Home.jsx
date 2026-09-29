// Home — hero banner + every category row from /api/categories.
import Row from '../components/Row.jsx';
import Hero from '../components/Hero.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { applyFilter } from '../data/helpers.js';

export default function Home() {
  const { movies, categories, loading, offline } = useStore();

  if (loading) return <Loading />;
  if (offline) return <OfflineNotice />;

  // Featured title = highest-rated trending item (falls back to top-rated).
  const featured =
    movies.filter((m) => m.trending).sort((a, b) => b.rating - a.rating)[0] ||
    movies[0];

  return (
    <main className="page">
      <Hero movie={featured} />
      <div className="page__rows">
        {categories.map((cat) => (
          <Row key={cat.id} title={cat.title} items={applyFilter(movies, cat.filter)} />
        ))}
      </div>
    </main>
  );
}

// Shared loading shimmer + offline notice (used by all pages).
export function Loading() {
  return (
    <div className="loading" aria-label="Loading">
      <div className="loading__spinner" />
      <p>Loading StreamFlix…</p>
    </div>
  );
}

export function OfflineNotice() {
  return (
    <div className="offline">
      <h2>Can't reach the StreamFlix API</h2>
      <p>The frontend couldn't load data from <code>http://localhost:5000</code>.</p>
      <p>Start the backend and refresh:</p>
      <pre>cd server{'\n'}npm run dev</pre>
    </div>
  );
}