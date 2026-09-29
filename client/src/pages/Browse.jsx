// Browse — shared page for /movies and /tv.
// Shows a type-specific hero plus genre rows for that type only.
import Hero from '../components/Hero.jsx';
import Row from '../components/Row.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { applyFilter } from '../data/helpers.js';
import { Loading, OfflineNotice } from './Home.jsx';

const GENRES = ['Action', 'Comedy', 'Sci-Fi', 'Thriller', 'Drama', 'Horror', 'Romance', 'Mystery'];

export default function Browse({ type }) {
  const { movies, loading, offline } = useStore();

  if (loading) return <Loading />;
  if (offline) return <OfflineNotice />;

  const pool = movies.filter((m) => m.type === type);
  const label = type === 'tv' ? 'TV Shows' : 'Movies';
  const featured = [...pool].sort((a, b) => b.rating - a.rating)[0];

  return (
    <main className="page">
      <Hero movie={featured} />
      <div className="page__rows">
        <Row
          title={`Popular on StreamFlix`}
          items={[...pool].sort((a, b) => b.rating - a.rating)}
        />
        <Row title={`New ${label}`} items={pool.filter((m) => m.isNew)} />
        {GENRES.map((genre) => (
          <Row key={genre} title={genre} items={applyFilter(pool, { genre })} />
        ))}
      </div>
    </main>
  );
}