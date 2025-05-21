import { useState, useEffect, useRef } from 'react';
import { getBookings, deleteBooking } from '../api/fetchBookings';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const upcomingScrollRef = useRef(null);
  const pastScrollRef = useRef(null);

  // State for arrow visibility
  const [upcomingScroll, setUpcomingScroll] = useState({ atStart: true, atEnd: false });
  const [pastScroll, setPastScroll] = useState({ atStart: true, atEnd: false });

  const updateScrollState = (ref, setState) => {
    if (!ref.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = ref.current;
    setState({
      atStart: scrollLeft <= 0,
      atEnd: scrollLeft + clientWidth >= scrollWidth - 1, // -1 for rounding errors
    });
  };

  const scrollLeft = (ref, setState) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: 'smooth' });
      setTimeout(() => updateScrollState(ref, setState), 300);
    }
  };

  const scrollRight = (ref, setState) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: 'smooth' });
      setTimeout(() => updateScrollState(ref, setState), 300);
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookings();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Update scroll state on mount and when bookings change
  useEffect(() => {
    updateScrollState(upcomingScrollRef, setUpcomingScroll);
    updateScrollState(pastScrollRef, setPastScroll);
  }, [bookings]);

  const now = new Date();
  const upcomingBookings = bookings
    .filter(booking => new Date(booking.dateTo) >= now)
    .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
  const pastBookings = bookings.filter(booking => new Date(booking.dateTo) < now);
  const isOngoing = (booking) => {
    const from = new Date(booking.dateFrom);
    const to = new Date(booking.dateTo);
    return from <= now && to >= now;
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="min-h-[400px] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-12 max-w-[1400px] mx-auto">
        {/* Upcoming Bookings */}
        <section className="bg-white rounded-2xl shadow-lg p-6 pb-8 flex flex-col items-center border-2 border-[#0C5560]/10 w-full">
          <div className="flex items-center gap-2 mb-8">
            <span className="block w-2 h-6 bg-[#0C5560] rounded-full"></span>
            <h2 className="text-2xl font-bold text-[#0C5560]">Upcoming Bookings</h2>
          </div>
          {upcomingBookings.length === 0 ? (
            <p className="text-gray-500">No upcoming bookings</p>
          ) : (
            <div className="w-full flex items-center gap-2">
              {upcomingBookings.length > 1 && !upcomingScroll.atStart && (
                <button
                  className="bg-white/80 rounded-full p-2 shadow hover:bg-white flex-shrink-0"
                  onClick={() => scrollLeft(upcomingScrollRef, setUpcomingScroll)}
                  aria-label="Scroll left"
                >
                  <FaChevronLeft size={20} />
                </button>
              )}
              <div
                ref={upcomingScrollRef}
                className="overflow-x-auto pb-4 lg:scrollbar-hide flex-1"
                style={{ scrollBehavior: 'smooth' }}
                onScroll={() => updateScrollState(upcomingScrollRef, setUpcomingScroll)}
              >
                <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:gap-6 min-w-min">
                  {upcomingBookings.map(booking => (
                    <div key={booking.id} className="flex flex-col items-center">
                      <div 
                        onClick={() => navigate(`/bookings/${booking.id}`)}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer min-w-[320px] max-w-xs w-full"
                      >
                        <div className="relative">
                          <img
                            src={booking.venue.media[0]?.url}
                            alt={booking.venue.media[0]?.alt || 'Venue image'}
                            className="w-full h-36 object-cover"
                          />
                          <div className="absolute top-0 right-0 bg-white px-2 py-0.5 m-2 rounded-full text-xs font-medium">
                            {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
                          </div>
                        </div>
                        <div className="p-3 flex flex-col gap-2">
                          <div className="min-h-[28px]">
                            {isOngoing(booking) && (
                              <div className="px-3 py-1 bg-[#0C5560] text-white text-xs font-semibold rounded-full w-fit shadow">
                                This booking is ongoing
                              </div>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold truncate mb-1">{booking.venue.name}</h3>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="text-xs font-medium text-gray-500">Check-in</p>
                                <p className="text-sm">{formatDate(booking.dateFrom)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="text-xs font-medium text-gray-500">Check-out</p>
                                <p className="text-sm">{formatDate(booking.dateTo)}</p>
                              </div>
                            </div>
                            {booking.venue.location && (
                              <div className="flex items-center gap-1.5">
                                <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
                                <p className="text-sm truncate">{booking.venue.location.city}, {booking.venue.location.country}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {upcomingBookings.length > 1 && !upcomingScroll.atEnd && (
                <button
                  className="bg-white/80 rounded-full p-2 shadow hover:bg-white flex-shrink-0"
                  onClick={() => scrollRight(upcomingScrollRef, setUpcomingScroll)}
                  aria-label="Scroll right"
                >
                  <FaChevronRight size={20} />
                </button>
              )}
            </div>
          )}
        </section>

        {/* Past Bookings */}
        <section className="bg-white rounded-2xl shadow-lg p-6 pb-8 flex flex-col items-center border-2 border-[#0C5560]/10 w-full">
          <div className="flex items-center gap-2 mb-8">
            <span className="block w-2 h-6 bg-[#0C5560] rounded-full"></span>
            <h2 className="text-2xl font-bold text-[#0C5560]">Past Bookings</h2>
          </div>
          {pastBookings.length === 0 ? (
            <p className="text-gray-500">No past bookings</p>
          ) : (
            <div className="w-full flex items-center gap-2">
              {pastBookings.length > 1 && !pastScroll.atStart && (
                <button
                  className="bg-white/80 rounded-full p-2 shadow hover:bg-white flex-shrink-0"
                  onClick={() => scrollLeft(pastScrollRef, setPastScroll)}
                  aria-label="Scroll left"
                >
                  <FaChevronLeft size={20} />
                </button>
              )}
              <div
                ref={pastScrollRef}
                className="overflow-x-auto pb-4 lg:scrollbar-hide flex-1"
                style={{ scrollBehavior: 'smooth' }}
                onScroll={() => updateScrollState(pastScrollRef, setPastScroll)}
              >
                <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-stretch lg:gap-6 min-w-min">
                  {pastBookings.map(booking => (
                    <div 
                      key={booking.id} 
                      onClick={() => navigate(`/bookings/${booking.id}`)}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer min-w-[320px] max-w-xs w-full"
                    >
                      <div className="relative">
                        <img
                          src={booking.venue.media[0]?.url}
                          alt={booking.venue.media[0]?.alt || 'Venue image'}
                          className="w-full h-36 object-cover"
                        />
                        <div className="absolute top-0 right-0 bg-white px-2 py-0.5 m-2 rounded-full text-xs font-medium">
                          {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="mb-2 px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full w-fit">
                          This booking is over and cannot be modified
                        </div>
                        <h3 className="text-lg font-semibold truncate mb-1">{booking.venue.name}</h3>
                        <div className="space-y-1 text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-xs font-medium text-gray-500">Check-in</p>
                              <p className="text-sm">{formatDate(booking.dateFrom)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-xs font-medium text-gray-500">Check-out</p>
                              <p className="text-sm">{formatDate(booking.dateTo)}</p>
                            </div>
                          </div>
                          {booking.venue.location && (
                            <div className="flex items-center gap-1.5">
                              <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
                              <p className="text-sm truncate">{booking.venue.location.city}, {booking.venue.location.country}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {pastBookings.length > 1 && !pastScroll.atEnd && (
                <button
                  className="bg-white/80 rounded-full p-2 shadow hover:bg-white flex-shrink-0"
                  onClick={() => scrollRight(pastScrollRef, setPastScroll)}
                  aria-label="Scroll right"
                >
                  <FaChevronRight size={20} />
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
