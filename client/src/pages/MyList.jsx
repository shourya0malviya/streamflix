// MyList — everything the user saved. Persisted in localStorage
// by StoreContext, so it survives refreshes and browser restarts.
import MovieCard from '../components/MovieCard.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { Loading, OfflineNotice } from './Home.jsx';

export default function MyList() {
  const { myList, loading, offline } = useStore();

  if (loading) return <Loading />;
  if (offline) return <OfflineNotice />;

  return (
    <main className="page page--plain">
      <h2 className="page__heading">My List</h2>
      {myList.length === 0 ? (
        <div className="empty">
          <p>Your list is empty.</p>
          <p>Hover any title and press <strong>+ My List</strong> to save it here.</p>
        </div>
      ) : (
        <div className="grid">
          {myList.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </main>
  );
}