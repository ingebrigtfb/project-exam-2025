import { useEffect, useState, useRef } from 'react';
import { fetchVenues } from '../api/fetchVenues';
import VenueCard from '../components/cards/VenueCard';
import Paginator from '../components/venues/Paginator';
import BookingSearch from '../components/venues/BookingSearch';
import AuthModal from '../auth/components/AuthModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaSearch } from 'react-icons/fa';

const VENUES_PER_PAGE = 24;

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [page, setPage] = useState(1);
  const [totalVenues, setTotalVenues] = useState(0);
  const [loading, setLoading] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [search, setSearch] = useState({ where: '', checkIn: '', checkOut: '', guests: 1 });
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

  const handleAuthSuccess = (userData) => {
    const userId = userData.name;
    const newFavoritesKey = `favorites_${userId}`;
    
    // Update user and favorites key after login
    setFavorites(JSON.parse(localStorage.getItem(newFavoritesKey)) || []);
    setAuthOpen(false);
    
    // Note: Redirection is handled by the AuthModal component
  };

  const loadVenues = async (pageNum = page, searchParams = search) => {
    setLoading(true);
    let url;
    let venuesList = [];
    
    if (searchParams.where) {
      // For search results, fetch all venues without pagination
      url = `https://v2.api.noroff.dev/holidaze/venues/search?q=${encodeURIComponent(searchParams.where)}&limit=100&sort=created&sortOrder=desc`;
      const res = await fetch(url);
      const data = await res.json();
      venuesList = data.data || [];
      setTotalVenues(data.meta?.totalCount || 0);

      // Apply guest filter to search results
      if (searchParams.guests) {
        venuesList = venuesList.filter(venue => venue.maxGuests >= searchParams.guests);
        setTotalVenues(venuesList.length);
      }
    } else {
      const guestsFilter = searchParams.guests ? `&maxGuests_gte=${searchParams.guests}` : '';
      url = `https://v2.api.noroff.dev/holidaze/venues?limit=${VENUES_PER_PAGE}&page=${pageNum}${guestsFilter}&sort=created&sortOrder=desc`;
      const res = await fetch(url);
      const data = await res.json();
      venuesList = data.data || [];
      
      if (searchParams.guests) {
        setTotalVenues(data.meta?.totalCount || 0);
      } else {
        setTotalVenues(data.meta?.totalCount || 0);
      }
    }

    // Date-availability filtering
    if (searchParams.checkIn && searchParams.checkOut) {
      const checkIn = new Date(searchParams.checkIn);
      const checkOut = new Date(searchParams.checkOut);
      
      // Helper to check date overlap
      const isDateOverlap = (aStart, aEnd, bStart, bEnd) => {
        return (aStart <= bEnd) && (bStart <= aEnd);
      };

      // Fetch bookings for each venue in parallel
      const venuesWithBookings = await Promise.all(
        venuesList.map(async (venue) => {
          try {
            // Use the public venue endpoint with _bookings=true
            const res = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venue.id}?_bookings=true`);
            if (!res.ok) {
              return { ...venue, bookings: [] };
            }
            const data = await res.json();
            return { ...venue, bookings: data.data.bookings || [] };
          } catch {
            return { ...venue, bookings: [] };
          }
        })
      );

      // Filter out venues with overlapping bookings
      venuesList = venuesWithBookings.filter(venue => {
        return !venue.bookings.some(booking => {
          const bookingStart = new Date(booking.dateFrom);
          const bookingEnd = new Date(booking.dateTo);
          return isDateOverlap(checkIn, checkOut, bookingStart, bookingEnd);
        });
      });
    }

    setVenues(venuesList);
    setLoading(false);
  };

  useEffect(() => {
    loadVenues(page, search);
  }, [page, search]);

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

  // Always reset page to 1 on new search
  const handleSearch = (values) => {
    setPage(1);
    setSearch(values);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BookingSearch onSearch={setSearch} />
      {loading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : venues.length === 0 ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center px-4">
          <FaSearch className="text-6xl text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No venues found</h2>
          <p className="text-gray-500 max-w-md">
            {search.where || search.checkIn || search.checkOut || search.guests > 1
              ? "We couldn't find any venues matching your search criteria. Try adjusting your search or clear the filters to browse all venues."
              : "No venues are currently available. Please check back later."}
          </p>
        </div>
      ) : (
        <>
          <div className="w-full flex justify-center mt-24">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-[1400px] mx-auto">
              {venues.map(venue => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  isFavorite={favorites.includes(venue.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onRequireAuth={() => setAuthOpen(true)}
                />
              ))}
            </div>
          </div>
          {/* Only show pagination when not searching */}
          {!search.where && !search.checkIn && !search.checkOut && search.guests === 1 && (
            <div className="w-full flex justify-center mt-12">
              <Paginator
                page={page}
                totalPages={Math.ceil(totalVenues / VENUES_PER_PAGE)}
                setPage={setPage}
                loading={loading}
              />
            </div>
          )}
        </>
      )}
      <AuthModal 
        open={authOpen} 
        onClose={() => setAuthOpen(false)} 
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Venues;

