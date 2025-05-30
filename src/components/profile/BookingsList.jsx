import { useState, useEffect } from 'react';
import { getBookings } from '../../api/fetchBookings';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';

export default function BookingsList() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // State for pagination
  const [upcomingLimit, setUpcomingLimit] = useState(4);
  const [pastLimit, setPastLimit] = useState(4);

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

  const now = new Date();
  const upcomingBookings = bookings
    .filter(booking => new Date(booking.dateTo) >= now)
    .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
  const pastBookings = bookings
    .filter(booking => new Date(booking.dateTo) < now)
    .sort((a, b) => new Date(b.dateFrom) - new Date(a.dateFrom)); // Most recent first

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
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-8">{error}</div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center mt-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Found</h3>
        <p className="text-gray-500 mb-6">You haven't made any bookings yet.</p>
        <button 
          onClick={() => navigate('/venues')}
          className="px-4 py-2 bg-[#0C5560] text-white rounded-lg hover:bg-[#094147] transition-colors"
        >
          Browse Venues
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Upcoming Bookings */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <span className="block w-2 h-6 bg-[#0C5560] rounded-full"></span>
          <h2 className="text-2xl font-bold text-[#0C5560]">Upcoming Bookings</h2>
        </div>
        
        {upcomingBookings.length === 0 ? (
          <p className="text-gray-500">No upcoming bookings</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingBookings.slice(0, upcomingLimit).map(booking => (
                <div 
                  key={booking.id} 
                  onClick={() => navigate(`/bookings/${booking.id}`)}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full"
                >
                  <div className="relative">
                    <img
                      src={booking.venue.media[0]?.url}
                      alt={booking.venue.media[0]?.alt || 'Venue image'}
                      className="w-full h-48 sm:h-36 object-cover"
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
              ))}
            </div>
            
            {upcomingBookings.length > upcomingLimit && (
              <div className="mt-6 text-center">
                <button 
                  onClick={() => setUpcomingLimit(prev => prev + 4)}
                  className="px-4 py-2 bg-[#0C5560] text-white rounded-lg hover:bg-[#094147] transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Past Bookings */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <span className="block w-2 h-6 bg-[#0C5560] rounded-full"></span>
          <h2 className="text-2xl font-bold text-[#0C5560]">Past Bookings</h2>
        </div>
        
        {pastBookings.length === 0 ? (
          <p className="text-gray-500">No past bookings</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pastBookings.slice(0, pastLimit).map(booking => (
                <div 
                  key={booking.id} 
                  onClick={() => navigate(`/bookings/${booking.id}`)}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full"
                >
                  <div className="relative">
                    <img
                      src={booking.venue.media[0]?.url}
                      alt={booking.venue.media[0]?.alt || 'Venue image'}
                      className="w-full h-48 sm:h-36 object-cover"
                    />
                    <div className="absolute top-0 right-0 bg-white px-2 py-0.5 m-2 rounded-full text-xs font-medium">
                      {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="mb-2 px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full w-fit">
                      Past booking
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
            
            {pastBookings.length > pastLimit && (
              <div className="mt-6 text-center">
                <button 
                  onClick={() => setPastLimit(prev => prev + 4)}
                  className="px-4 py-2 bg-[#0C5560] text-white rounded-lg hover:bg-[#094147] transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
} 