// MovieCard — one poster tile inside a horizontal row or grid.
// Hover: scales up and reveals a small overlay with meta + "My List" button.
import { posterUrl } from '../data/helpers.js';
import { useStore } from '../context/StoreContext.jsx';

export default function MovieCard({ movie }) {
  const { openModal, toggleMyList, isInMyList } = useStore();
  const inList = isInMyList(movie.id);

  // If picsum.photos is unreachable, hide the broken image so the
  // gradient + title fallback underneath stays visible.
  const handleImageError = (e) => {
    e.currentTarget.style.display = 'none';
  };

  return (
    <div className="movie-card" onClick={() => openModal(movie)}>
      <div className="movie-card__poster">
        <img src={posterUrl(movie)} alt={movie.title} loading="lazy" onError={handleImageError} />
        <span className="movie-card__fallback-title">{movie.title}</span>

        {/* Overlay shown on hover (desktop) */}
        <div className="movie-card__overlay">
          <h4 className="movie-card__title">{movie.title}</h4>
          <p className="movie-card__meta">
            <span className="badge badge--rating">★ {movie.rating}</span>
            <span>{movie.year}</span>
            <span>{movie.type === 'tv' ? 'Series' : movie.duration}</span>
          </p>
          <p className="movie-card__genres">{movie.genres.join(' • ')}</p>
          <button
            type="button"
            className={`btn btn--small ${inList ? 'btn--ghost' : 'btn--primary'}`}
            onClick={(e) => {
              e.stopPropagation(); // don't open the modal when toggling the list
              toggleMyList(movie);
            }}
          >
            {inList ? '✓ In My List' : '+ My List'}
          </button>
        </div>
      </div>
    </div>
  );
}