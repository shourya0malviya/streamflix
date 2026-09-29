// Row — a titled, horizontally scrollable strip of MovieCards.
// Left/right chevron buttons scroll one "page" at a time.
import { useRef } from 'react';
import MovieCard from './MovieCard.jsx';

export default function Row({ title, items }) {
  const scrollerRef = useRef(null);

  const scrollByPage = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    const page = el.clientWidth * 0.9;
    el.scrollBy({ left: direction * page, behavior: 'smooth' });
  };

  // Don't render an empty row (e.g. a genre with no titles in the data set).
  if (!items || items.length === 0) return null;

  return (
    <section className="row" aria-label={title}>
      <h3 className="row__title">{title}</h3>
      <div className="row__wrapper">
        <button
          type="button"
          className="row__arrow row__arrow--left"
          aria-label={`Scroll ${title} left`}
          onClick={() => scrollByPage(-1)}
        >
          ‹
        </button>

        <div className="row__scroller" ref={scrollerRef}>
          {items.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <button
          type="button"
          className="row__arrow row__arrow--right"
          aria-label={`Scroll ${title} right`}
          onClick={() => scrollByPage(1)}
        >
          ›
        </button>
      </div>
    </section>
  );
}