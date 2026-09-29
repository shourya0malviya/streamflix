// Hero — the big cinematic banner at the top of the home/browse pages.
import { backdropUrl } from '../data/helpers.js';
import { useStore } from '../context/StoreContext.jsx';
import Player from './Player.jsx';
import { useState } from 'react';

export default function Hero({ movie }) {
  const { openModal } = useStore();
  const [playing, setPlaying] = useState(false);

  if (!movie) return null;

  return (
    <section className="hero">
      <img className="hero__backdrop" src={backdropUrl(movie, 1600)} alt="" />
      {/* Gradient overlays keep the text readable on any image */}
      <div className="hero__shade hero__shade--left" />
      <div className="hero__shade hero__shade--bottom" />

      <div className="hero__content">
        <p className="hero__kicker">
          {movie.type === 'tv' ? 'StreamFlix Original Series' : 'StreamFlix Original Film'}
        </p>
        <h1 className="hero__title">{movie.title}</h1>
        <p className="hero__meta">
          <span className="badge badge--rating">★ {movie.rating}</span>
          <span>{movie.year}</span>
          <span className="badge badge--outline">{movie.genres[0]}</span>
        </p>
        <p className="hero__description">{movie.description}</p>
        <div className="hero__actions">
          <button type="button" className="btn btn--light" onClick={() => setPlaying(true)}>
            ▶ Play
          </button>
          <button type="button" className="btn btn--glass" onClick={() => openModal(movie)}>
            ⓘ More Info
          </button>
        </div>
      </div>

      {/* Fullscreen fake player (no real video — this is a UI demo) */}
      {playing && <Player movie={movie} onClose={() => setPlaying(false)} />}
    </section>
  );
}