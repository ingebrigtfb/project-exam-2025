import { useEffect, useState, useRef } from 'react';
import { fetchVenues } from '../api/fetchVenues';
import VenueCard from '../components/VenueCard';
import Paginator from '../components/venues/Paginator';
import AuthModal from '../auth/components/AuthModal';

const VENUES_PER_PAGE = 12;

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [page, setPage] = useState(1);
  const [totalVenues, setTotalVenues] = useState(0);
  const [loading, setLoading] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const prevLoading = useRef(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const favoritesKey = user ? `favorites_${user.name}` : null;
  const [favorites, setFavorites] = useState(() => {
    if (!favoritesKey) return [];
    try {
      return JSON.parse(localStorage.getItem(favoritesKey)) || [];
    } catch {
      return [];
    }
  });

  const saveFavorites = (fav) => {
    if (!favoritesKey) return;
    setFavorites(fav);
    localStorage.setItem(favoritesKey, JSON.stringify(fav));
  };

  const handleToggleFavorite = (venueId) => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    const isFav = favorites.includes(venueId);
    const newFavs = isFav ? favorites.filter(id => id !== venueId) : [...favorites, venueId];
    saveFavorites(newFavs);
  };

  const loadVenues = async (pageNum = page) => {
    setLoading(true);
    const newVenues = await fetchVenues(pageNum, VENUES_PER_PAGE);
    setVenues(newVenues);
    setLoading(false);
  };

  // Fetch total venues count on mount
  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const res = await fetch('https://v2.api.noroff.dev/holidaze/venues');
        const data = await res.json();
        setTotalVenues(data.meta?.totalCount || 0);
      } catch {
        setTotalVenues(100); // fallback
      }
    };
    fetchTotal();
  }, []);

  useEffect(() => {
    loadVenues(page);
  }, [page]);

  useEffect(() => {
    if (prevLoading.current && !loading) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    prevLoading.current = loading;
  }, [loading, page]);

  useEffect(() => {
    if (favoritesKey) {
      try {
        setFavorites(JSON.parse(localStorage.getItem(favoritesKey)) || []);
      } catch {
        setFavorites([]);
      }
    }
  }, [favoritesKey]);

  const totalPages = Math.ceil(totalVenues / VENUES_PER_PAGE);

  return (
    <div className="flex flex-col items-center py-8">
      <div className="w-full max-w-[1400px] mx-auto flex flex-wrap gap-6 justify-center">
        {venues.map((venue) => (
          <VenueCard
            key={venue.id}
            venue={venue}
            isFavorite={favorites.includes(venue.id)}
            onToggleFavorite={handleToggleFavorite}
            onRequireAuth={() => setAuthOpen(true)}
          />
        ))}
      </div>
      <Paginator
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        loading={loading}
      />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
};

export default Venues;

