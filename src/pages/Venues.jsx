import { useEffect, useState, useRef } from 'react';
import { fetchVenues } from '../api/fetchVenues';
import VenueCard from '../components/VenueCard';
import Paginator from '../components/venues/Paginator';
import BookingSearch from '../components/venues/BookingSearch';
import AuthModal from '../auth/components/AuthModal';

const VENUES_PER_PAGE = 12;

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

  const loadVenues = async (pageNum = page, searchParams = search) => {
    setLoading(true);
    let url;
    if (searchParams.where) {
      url = `https://v2.api.noroff.dev/holidaze/venues/search?q=${encodeURIComponent(searchParams.where)}&limit=${VENUES_PER_PAGE}&page=${pageNum}`;
    } else {
      url = `https://v2.api.noroff.dev/holidaze/venues?limit=${VENUES_PER_PAGE}&page=${pageNum}`;
    }
    if (searchParams.guests) url += `&maxGuests_gte=${searchParams.guests}`;
    // Note: The API does not support date filtering directly
    const res = await fetch(url);
    const data = await res.json();
    let venuesList = data.data || [];

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
            const res = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venue.id}?_bookings=true`);
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

    // Client-side guests filter
    if (searchParams.guests) {
      venuesList = venuesList.filter(venue => venue.maxGuests >= searchParams.guests);
    }

    setVenues(venuesList);
    setTotalVenues(data.meta?.totalCount || 0); // Note: totalCount may not match filtered count
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
    <div className="w-full flex flex-col items-center px-2 md:px-6 py-8">
      <div className="w-full flex flex-col items-center">
        <BookingSearch onSearch={handleSearch} />
      </div>
      <div className="w-full flex justify-center mt-24">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-[1400px] mx-auto">
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
      </div>
      <div className="w-full flex justify-center mt-12">
        <Paginator
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          loading={loading}
        />
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
};

export default Venues;

