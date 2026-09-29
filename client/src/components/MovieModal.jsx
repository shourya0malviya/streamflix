// MovieModal — the details dialog that opens when a card is clicked.
// Closes on: ✕ button, backdrop click, or Escape (handled in StoreContext).
import { useEffect } from 'react';
import { backdropUrl, posterUrl } from '../data/helpers.js';
import { useStore } from '../context/StoreContext.jsx';
import Player from './Player.jsx';
import { useState } from 'react';

export default function MovieModal() {
  const { activeMovie, closeModal, toggleMyList, isInMyList } = useStore();
  const [playing, setPlaying] = useState(false);

  // Lock page scroll while the modal is open; reset "playing" per movie.
  useEffect(() => {
    if (activeMovie) {
      document.body.style.overflow = 'hidden';
      setPlaying(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeMovie]);

  if (!activeMovie) return null;

  const movie = activeMovie;
  const inList = isInMyList(movie.id);

  return (
    <div className="modal" onClick={closeModal} role="dialog" aria-label={movie.title}>
      {/* stopPropagation so clicks inside the card don't close the modal */}
      <div className="modal__card" onClick={(e) => e.stopPropagation()}>
        <div className="modal__hero">
          <img className="modal__backdrop" src={backdropUrl(movie, 1280)} alt="" />
          <div className="modal__shade" />
          <button type="button" className="modal__close" onClick={closeModal} aria-label="Close">
            ✕
          </button>
          <div className="modal__hero-text">
            <h2>{movie.title}</h2>
            <div className="modal__actions">
              <button type="button" className="btn btn--light" onClick={() => setPlaying(true)}>
                ▶ Play
              </button>
              <button
                type="button"
                className={`btn btn--glass ${inList ? 'is-in-list' : ''}`}
                onClick={() => toggleMyList(movie)}
              >
                {inList ? '✓ In My List' : '+ My List'}
              </button>
            </div>
          </div>
        </div>

        <div className="modal__body">
          <div className="modal__stats">
            <p>
              <span className="badge badge--rating">★ {movie.rating}</span>
            </p>
            <p><strong>{movie.year}</strong></p>
            <p><strong>{movie.duration}</strong></p>
            <p><span className="badge badge--outline">{movie.type === 'tv' ? 'TV Series' : 'Film'}</span></p>
          </div>
          <p className="modal__description">{movie.description}</p>
          <p className="modal__genres">
            <span className="muted">Genres: </span>
            {movie.genres.join(', ')}
          </p>
          <img className="modal__poster" src={posterUrl(movie)} alt={`${movie.title} poster`} />
        </div>
      </div>

      {playing && <Player movie={movie} onClose={() => setPlaying(false)} />}
    </div>
  );
}