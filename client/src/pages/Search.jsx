// Search — client-side filtering of the loaded catalog.
// The navbar's search input writes ?q=... and this page reads it.
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { searchMovies } from '../data/helpers.js';
import { Loading, OfflineNotice } from './Home.jsx';

export default function Search() {
  const { movies, loading, offline } = useStore();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  if (loading) return <Loading />;
  if (offline) return <OfflineNotice />;

  const results = searchMovies(movies, query);

  return (
    <main className="page page--plain">
      <h2 className="page__heading">
        {query ? <>Results for “{query}”</> : 'Search StreamFlix'}
      </h2>

      {!query && (
        <div className="empty">
          <p>Type in the search box (top right 🔍) to find titles by name or genre.</p>
        </div>
      )}

      {query && results.length === 0 && (
        <div className="empty">
          <p>No titles match “{query}”.</p>
          <p>Try a different name, or a genre like “sci-fi”, “comedy” or “thriller”.</p>
        </div>
      )}

      {results.length > 0 && (
        <>
          <p className="muted">{results.length} result(s)</p>
          <div className="grid">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}