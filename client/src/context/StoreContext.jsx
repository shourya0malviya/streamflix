// StoreContext — the single source of truth for the whole app:
//   - the movie list + categories fetched from the Express API
//   - "My List" (persisted to localStorage)
//   - which movie is currently open in the details modal
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const StoreContext = createContext(null);
const MY_LIST_KEY = 'streamflix-my-list';

// Try to read saved list from localStorage (safe if storage is unavailable).
function loadMyList() {
  try {
    const raw = localStorage.getItem(MY_LIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function StoreProvider({ children }) {
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [activeMovie, setActiveMovie] = useState(null); // movie shown in the modal
  const [myList, setMyList] = useState(loadMyList);

  // Fetch movies + categories from the backend once, on first mount.
  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        const [moviesRes, categoriesRes] = await Promise.all([
          fetch('/api/movies'),
          fetch('/api/categories')
        ]);
        if (!moviesRes.ok || !categoriesRes.ok) throw new Error('API error');
        const moviesData = await moviesRes.json();
        const categoriesData = await categoriesRes.json();
        if (cancelled) return;
        setMovies(moviesData);
        setCategories(categoriesData);
        setOffline(false);
      } catch {
        // Backend unreachable — surface a banner, show an empty page.
        if (!cancelled) {
          setMovies([]);
          setCategories([]);
          setOffline(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist My List to localStorage whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(MY_LIST_KEY, JSON.stringify(myList));
    } catch {
      /* storage full/blocked — list just won't persist */
    }
  }, [myList]);

  const toggleMyList = (movie) => {
    setMyList((prev) =>
      prev.some((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie]
    );
  };

  const isInMyList = (id) => myList.some((m) => m.id === id);

  const openModal = (movie) => setActiveMovie(movie);
  const closeModal = () => setActiveMovie(null);

  // Close the modal with the Escape key.
  useEffect(() => {
    if (!activeMovie) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeMovie]);

  const value = useMemo(
    () => ({
      movies,
      categories,
      loading,
      offline,
      activeMovie,
      openModal,
      closeModal,
      myList,
      toggleMyList,
      isInMyList
    }),
    [movies, categories, loading, offline, activeMovie, myList]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// Convenience hook for any component that needs app state.
export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}