// App — providers, routing, global chrome (navbar, footer, modal).
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import MovieModal from './components/MovieModal.jsx';
import Home from './pages/Home.jsx';
import Browse from './pages/Browse.jsx';
import MyList from './pages/MyList.jsx';
import Search from './pages/Search.jsx';

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Browse type="movie" />} />
          <Route path="/tv" element={<Browse type="tv" />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/search" element={<Search />} />
          {/* Fallback for unknown URLs */}
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
        {/* Single global modal — any card anywhere opens it */}
        <MovieModal />
      </BrowserRouter>
    </StoreProvider>
  );
}