// Player — a fake fullscreen "player" with an animated progress bar.
// No real video exists (this is a UI demo), so the backdrop slowly pans
// behind a spinner-ish play glyph while a timer runs.
import { useEffect, useRef, useState } from 'react';
import { backdropUrl } from '../data/helpers.js';

export default function Player({ movie, onClose }) {
  const [paused, setPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  // Tick the fake timer once per second while "playing".
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  // Escape closes the player.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const format = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="player" role="dialog" aria-label={`Playing ${movie.title}`}>
      <img className="player__backdrop" src={backdropUrl(movie, 1280)} alt="" />
      <div className="player__shade" />

      <button type="button" className="player__close" onClick={onClose} aria-label="Close player">
        ✕
      </button>

      <div className="player__center" onClick={() => setPaused((p) => !p)}>
        <div className={`player__play ${paused ? 'is-paused' : ''}`}>
          {paused ? '▶' : '❚❚'}
        </div>
        {!paused && <div className="player__pulse" />}
      </div>

      <div className="player__bar">
        <p className="player__title">{movie.title}</p>
        <div className="player__progress">
          <div className="player__progress-fill" style={{ width: `${(seconds % 600) / 6}%` }} />
        </div>
        <p className="player__time">{format(seconds)} — preview (demo UI, no real video)</p>
      </div>
    </div>
  );
}