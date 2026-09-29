// Navbar — brand, nav links, expanding search box, profile dropdown.
// The bar is transparent over the hero and fades to solid on scroll.
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // mobile hamburger
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // Solid background after the user scrolls past the hero edge.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Focus the input whenever the search box opens.
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const query = searchParams.get('q') || '';

  const onSearchChange = (e) => {
    const value = e.target.value;
    // Search lives at /search?q=... — typing navigates there instantly.
    if (value) navigate(`/search?q=${encodeURIComponent(value)}`, { replace: true });
    else navigate('/search', { replace: true });
  };

  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/movies', label: 'Movies' },
    { to: '/tv', label: 'TV Shows' },
    { to: '/my-list', label: 'My List' }
  ];

  return (
    <header className={`navbar ${scrolled || searchOpen ? 'navbar--solid' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
          Stream<span>Flix</span>
        </Link>

        {/* Desktop links */}
        <nav className="navbar__links">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `navbar__link ${isActive ? 'is-active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          {/* Expanding search input */}
          <div className={`navbar__search ${searchOpen ? 'is-open' : ''}`}>
            <button
              type="button"
              className="navbar__search-toggle"
              aria-label="Toggle search"
              onClick={() => {
                setSearchOpen((o) => !o);
                if (query) navigate('/'); // closing with text clears the search
              }}
            >
              🔍
            </button>
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Titles, genres..."
              value={query}
              onChange={onSearchChange}
              aria-label="Search titles"
            />
          </div>

          {/* Profile dropdown (static demo profiles) */}
          <div className="navbar__profile" onMouseLeave={() => setProfileOpen(false)}>
            <button
              type="button"
              className="navbar__avatar"
              aria-label="Profile menu"
              onClick={() => setProfileOpen((o) => !o)}
            >
              <span className="navbar__avatar-face">🙂</span> ▾
            </button>
            {profileOpen && (
              <div className="navbar__dropdown">
                <p className="navbar__dropdown-user">Shourya</p>
                <hr />
                <Link to="/my-list" onClick={() => setProfileOpen(false)}>My List</Link>
                <a href="#!" onClick={(e) => e.preventDefault()}>Manage Profiles</a>
                <a href="#!" onClick={(e) => e.preventDefault()}>Account</a>
                <a href="#!" onClick={(e) => e.preventDefault()}>Sign out</a>
              </div>
            )}
          </div>

          {/* Hamburger for tablet/mobile */}
          <button
            type="button"
            className="navbar__burger"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="navbar__mobile">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `navbar__link ${isActive ? 'is-active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}