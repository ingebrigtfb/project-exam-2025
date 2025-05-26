import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import LoadingSpinner from '../common/LoadingSpinner';

export default function VenueBookings({ venueId, venueName }) {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [upcomingLimit, setUpcomingLimit] = useState(3);
  const [pastLimit, setPastLimit] = useState(3);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const userData = JSON.parse(localStorage.getItem('user'));
        
        const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venueId}?_bookings=true&_customer=true`, {
          headers: {
            'Authorization': `Bearer ${userData.accessToken}`,
            'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        
        const data = await response.json();
        
        if (data.data?.bookings) {
          setBookings(data.data.bookings);
        } else {
          setBookings([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (venueId) {
      fetchBookings();
    }
  }, [venueId]);

  const now = new Date();
  const upcomingBookings = bookings
    .filter(booking => new Date(booking.dateTo) >= now)
    .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
  const pastBookings = bookings
    .filter(booking => new Date(booking.dateTo) < now)
    .sort((a, b) => new Date(b.dateFrom) - new Date(a.dateFrom));

  const isOngoing = (booking) => {
    const from = new Date(booking.dateFrom);
    const to = new Date(booking.dateTo);
    return from <= now && to >= now;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[150px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm mt-2">{error}</div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-gray-500 text-sm mt-2 italic">No bookings for this venue</div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Venue Name */}
      <h3 className="text-lg font-semibold">{venueName}</h3>
      
      {/* Upcoming Bookings */}
      <div>
        <h4 className="font-medium text-[#0C5560] mb-2 flex items-center">
          <span className="w-1.5 h-4 bg-[#0C5560] rounded-full mr-2"></span>
          Upcoming Bookings ({upcomingBookings.length})
        </h4>
        
        {upcomingBookings.length === 0 ? (
          <p className="text-gray-500 text-sm">No upcoming bookings</p>
        ) : (
          <>
            <div className="space-y-2">
              {upcomingBookings.slice(0, upcomingLimit).map(booking => (
                <div 
                  key={booking.id} 
                  onClick={() => navigate(`/bookings/${booking.id}`)}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow duration-300 cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1.5 text-gray-600 mb-1">
                        <FaUsers className="h-4 w-4 text-gray-400" />
                        <p className="text-sm">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                        <p className="text-sm">{formatDate(booking.dateFrom)} - {formatDate(booking.dateTo)}</p>
                      </div>
                    </div>
                    {isOngoing(booking) && (
                      <div className="px-2 py-1 bg-[#0C5560] text-white text-xs font-semibold rounded-full">
                        Ongoing
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Guest:</span>
                      <span className="ml-2">{booking.customer.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {upcomingBookings.length > upcomingLimit && (
              <div className="mt-3 text-right">
                <button 
                  onClick={() => setUpcomingLimit(prev => prev + 3)}
                  className="text-[#0C5560] text-sm hover:underline"
                >
                  Show more
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Past Bookings */}
      <div>
        <h4 className="font-medium text-[#0C5560] mb-2 flex items-center">
          <span className="w-1.5 h-4 bg-[#0C5560] rounded-full mr-2"></span>
          Past Bookings ({pastBookings.length})
        </h4>
        
        {pastBookings.length === 0 ? (
          <p className="text-gray-500 text-sm">No past bookings</p>
        ) : (
          <>
            <div className="space-y-2">
              {pastBookings.slice(0, pastLimit).map(booking => (
                <div 
                  key={booking.id} 
                  onClick={() => navigate(`/bookings/${booking.id}`)}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow duration-300 cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1.5 text-gray-600 mb-1">
                        <FaUsers className="h-4 w-4 text-gray-400" />
                        <p className="text-sm">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                        <p className="text-sm">{formatDate(booking.dateFrom)} - {formatDate(booking.dateTo)}</p>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                      Past
                    </div>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Guest:</span>
                      <span className="ml-2">{booking.customer.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {pastBookings.length > pastLimit && (
              <div className="mt-3 text-right">
                <button 
                  onClick={() => setPastLimit(prev => prev + 3)}
                  className="text-[#0C5560] text-sm hover:underline"
                >
                  Show more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 