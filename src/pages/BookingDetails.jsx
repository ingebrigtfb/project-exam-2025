import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBooking, deleteBooking } from '../api/fetchBookings';
import { FaArrowLeft, FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaWifi, FaParking, FaUtensils, FaPaw, FaEdit, FaTimes, FaUserFriends, FaMinus, FaPlus, FaUser, FaTrash } from 'react-icons/fa';
import ImageCarousel from '../components/imageCarousel/ImageCarousel';
import DatePicker from 'react-datepicker';
import LoadingSpinner from '../components/common/LoadingSpinner';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/datepicker-teal.css';
import usePageTitle from '../hooks/usePageTitle';

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editDateFrom, setEditDateFrom] = useState(null);
  const [editDateTo, setEditDateTo] = useState(null);
  const [editGuests, setEditGuests] = useState(1);
  const [venueBookings, setVenueBookings] = useState([]);
  const [isOwnBooking, setIsOwnBooking] = useState(false);
  
  usePageTitle('Booking Details');
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBooking(id);
        setBooking(data);
        
        // Check if the booking belongs to the current user
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser && data.customer && currentUser.name === data.customer.name) {
          setIsOwnBooking(true);
        } else {
          setIsOwnBooking(false);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const fetchVenueBookings = async () => {
    try {
      const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${booking.venue.id}?_bookings=true&_owner=true`);
      const data = await response.json();
      if (data.data?.bookings) {
        setVenueBookings(data.data.bookings.filter(b => b.id !== booking.id)); 
      }
    } catch (err) {

    }
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

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Booking not found</div>
      </div>
    );
  }

  // Only calculate isUpcoming after booking is loaded
  const now = new Date();
  const from = new Date(booking.dateFrom);
  const to = new Date(booking.dateTo);
  const isUpcoming = from > now;
  const isOngoing = from <= now && to >= now;

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }
    setCancelLoading(true);
    setCancelError('');
    try {
      await deleteBooking(booking.id);
      navigate('/profile?tab=bookings');
    } catch (err) {
      setCancelError(err.message || 'Failed to cancel booking');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleEditOpen = () => {
    setEditDateFrom(new Date(booking.dateFrom));
    setEditDateTo(new Date(booking.dateTo));
    setEditGuests(booking.guests);
    setEditOpen(true);
    fetchVenueBookings();
  };

  const isDateBooked = (date, isCheckIn = false) => {
    if (!venueBookings || !Array.isArray(venueBookings) || venueBookings.length === 0) return false;

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    if (!isCheckIn && editDateFrom && editDateFrom < checkDate) {
      for (const b of venueBookings) {
        const bookingStart = new Date(b.dateFrom);
        bookingStart.setHours(0, 0, 0, 0);
        
        const bookingEnd = new Date(b.dateTo);
        bookingEnd.setHours(0, 0, 0, 0);
        
        if (
          (bookingStart >= editDateFrom && bookingStart < checkDate) || 
          (bookingEnd > editDateFrom && bookingEnd <= checkDate) ||
          (bookingStart <= editDateFrom && bookingEnd >= checkDate)
        ) {
          return true; 
        }
      }
      return false;
    }
  
    return venueBookings.some(b => {
      // Convert booking dates to local midnight
      const bookingStart = new Date(b.dateFrom);
      bookingStart.setHours(0, 0, 0, 0);
      
      const bookingEnd = new Date(b.dateTo);
      bookingEnd.setHours(0, 0, 0, 0);
      
      // Check if the date falls within any booking period
      return checkDate >= bookingStart && checkDate <= bookingEnd;
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      // Validate dates
      if (!editDateFrom || !editDateTo) throw new Error('Please select both check-in and check-out dates');
      if (editDateFrom >= editDateTo) throw new Error('Check-out date must be after check-in date');
      
      // Check if the dates are in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (editDateFrom < today) throw new Error('Check-in date cannot be in the past');
      
      if (editGuests < 1) throw new Error('Number of guests must be at least 1');
      if (editGuests > booking.venue.maxGuests) throw new Error(`Maximum ${booking.venue.maxGuests} guests allowed`);
      
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.accessToken) throw new Error('No authentication token found');
      
      const response = await fetch(`https://v2.api.noroff.dev/holidaze/bookings/${booking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`,
          'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY
        },
        body: JSON.stringify({
          dateFrom: editDateFrom.toISOString(),
          dateTo: editDateTo.toISOString(),
          guests: editGuests
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to update booking: ${response.status}`);
      }
      
      const updated = await response.json();
      
      // Fetch the venue data for the updated booking
      const venueResponse = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${booking.venue.id}?_owner=true`);
      const venueData = await venueResponse.json();
      
      const updatedWithVenue = {
        ...updated.data,
        venue: venueData.data
      };
      
      setBooking(updatedWithVenue);
      setEditOpen(false);
      
      navigate(`/booking-confirmation/${updatedWithVenue.id}?edit=true`);
    } catch (err) {
      setEditError(err.message || 'Failed to update booking');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Venue Images */}
        <div className="mb-8">
          <ImageCarousel 
            images={booking.venue.media} 
            defaultAlt={`${booking.venue.name} images`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Information */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-semibold">Booking Information</h2>
                {isUpcoming && isOwnBooking && (
                  <div className="flex gap-2">
                    <button
                      className="bg-white/80 hover:bg-white rounded-full p-2 shadow text-[#0C5560] transition"
                      onClick={handleEditOpen}
                      title="Edit booking"
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      className="bg-white/80 hover:bg-white rounded-full p-2 shadow text-red-500 transition disabled:opacity-50"
                      onClick={handleCancelBooking}
                      disabled={cancelLoading}
                      title={cancelLoading ? "Cancelling..." : "Cancel booking"}
                    >
                      {cancelLoading ? <LoadingSpinner /> : <FaTrash size={20} />}
                    </button>
                  </div>
                )}
              </div>
              {cancelError && (
                <div className="text-red-500 text-sm mb-4">{cancelError}</div>
              )}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaCalendarAlt className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Check-in</p>
                    <p className="font-medium">{formatDate(booking.dateFrom)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCalendarAlt className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Check-out</p>
                    <p className="font-medium">{formatDate(booking.dateTo)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaUsers className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Guests</p>
                    <p className="font-medium">{booking.guests} people</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaUserFriends className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Booked by</p>
                    <p className="font-medium">{booking.customer.name}</p>
                    {booking.customer.email && (
                      <p className="text-sm text-gray-500">{booking.customer.email}</p>
                    )}
                  </div>
                </div>
              </div>
              {isOngoing && isOwnBooking && (
                <div className="mt-6 text-center text-[#0C5560] font-semibold bg-[#F1F8FA] rounded px-4 py-2">
                  You cannot edit or cancel this booking, because it's ongoing
                </div>
              )}
            </div>

            {/* Venue Location */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-6">Location</h2>
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-gray-600" />
                <div>
                  <p className="font-medium">{booking.venue.location.address}</p>
                  <p className="text-gray-600">
                    {booking.venue.location.city}, {booking.venue.location.zip}
                  </p>
                  <p className="text-gray-600">
                    {booking.venue.location.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Venue Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-6">Venue Details</h2>
              <p className="text-gray-600 mb-6">{booking.venue.description}</p>
              
              <div className="flex items-center space-x-3 mb-6">
                <FaUser className="text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Venue Owner</p>
                  <p className="font-medium">{booking.venue.owner?.name || 'Unknown'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {booking.venue.meta.wifi && (
                  <div className="flex items-center space-x-2">
                    <FaWifi className="text-gray-600" />
                    <span className="text-sm text-gray-600">WiFi</span>
                  </div>
                )}
                {booking.venue.meta.parking && (
                  <div className="flex items-center space-x-2">
                    <FaParking className="text-gray-600" />
                    <span className="text-sm text-gray-600">Parking</span>
                  </div>
                )}
                {booking.venue.meta.breakfast && (
                  <div className="flex items-center space-x-2">
                    <FaUtensils className="text-gray-600" />
                    <span className="text-sm text-gray-600">Breakfast</span>
                  </div>
                )}
                {booking.venue.meta.pets && (
                  <div className="flex items-center space-x-2">
                    <FaPaw className="text-gray-600" />
                    <span className="text-sm text-gray-600">Pets Allowed</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Price Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-2xl font-semibold mb-6">Price Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per night</span>
                  <span className="font-medium">${booking.venue.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Number of nights</span>
                  <span className="font-medium">
                    {Math.ceil((new Date(booking.dateTo) - new Date(booking.dateFrom)) / (1000 * 60 * 60 * 24))}
                  </span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">
                      ${booking.venue.price * Math.ceil((new Date(booking.dateTo) - new Date(booking.dateFrom)) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Booking Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md mx-auto rounded-2xl shadow-xl p-6 relative">
            <button
              onClick={() => setEditOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <FaTimes className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-semibold mb-6">Edit Booking</h2>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <DatePicker
                    selected={editDateFrom}
                    onChange={date => {
                      if (date) {
                        date.setHours(12, 0, 0, 0);
                        
                        // Check if there are any bookings between the new check-in date and the current check-out date
                        const shouldResetCheckout = editDateTo && venueBookings && Array.isArray(venueBookings) && 
                          venueBookings.some(b => {
                            const bookingStart = new Date(b.dateFrom);
                            bookingStart.setHours(0, 0, 0, 0);
                            
                            const bookingEnd = new Date(b.dateTo);
                            bookingEnd.setHours(0, 0, 0, 0);
                            
                            // Check if any part of this booking is between new check-in and current check-out
                            return (
                              (bookingStart >= date && bookingStart < editDateTo) || 
                              (bookingEnd > date && bookingEnd <= editDateTo) ||
                              (bookingStart <= date && bookingEnd >= editDateTo)
                            );
                          });
                        
                        setEditDateFrom(date);
                        
                        if (editDateTo && (date >= editDateTo || shouldResetCheckout)) {
                          setEditDateTo(null);
                        }
                      } else {
                        setEditDateFrom(null);
                      }
                    }}
                    selectsStart
                    startDate={editDateFrom}
                    endDate={editDateTo}
                    minDate={new Date()}
                    filterDate={date => !isDateBooked(date, true)}
                    placeholderText="Select check-in date"
                    className="w-full bg-gray-100 rounded-lg px-3 py-2 outline-none text-gray-700 placeholder-gray-400 text-base"
                    dateFormat="dd/MM/yyyy"
                    required
                    calendarStartDay={1}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <DatePicker
                    selected={editDateTo}
                    onChange={date => {
                      if (date) {
                        date.setHours(12, 0, 0, 0);
                        setEditDateTo(date);
                      } else {
                        setEditDateTo(null);
                      }
                    }}
                    selectsEnd
                    startDate={editDateFrom}
                    endDate={editDateTo}
                    minDate={editDateFrom || new Date()}
                    filterDate={date => !isDateBooked(date, false)}
                    placeholderText="Select check-out date"
                    className="w-full bg-gray-100 rounded-lg px-3 py-2 outline-none text-gray-700 placeholder-gray-400 text-base"
                    dateFormat="dd/MM/yyyy"
                    required
                    calendarStartDay={1}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of guests</label>
                <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
                  <FaUserFriends className="text-xl text-[#0C5560]" />
                  <button
                    type="button"
                    aria-label="Decrease guests"
                    onClick={() => setEditGuests(Math.max(1, editGuests - 1))}
                    className="p-1 rounded-full bg-white border border-gray-300 hover:bg-gray-200 transition disabled:opacity-50"
                    disabled={editGuests <= 1}
                  >
                    <FaMinus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    value={editGuests}
                    onChange={e => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val)) setEditGuests(val);
                    }}
                    min="1"
                    max={booking.venue.maxGuests}
                    className="w-12 text-center bg-transparent outline-none text-base font-semibold"
                    required
                  />
                  <button
                    type="button"
                    aria-label="Increase guests"
                    onClick={() => setEditGuests(Math.min(booking.venue.maxGuests, editGuests + 1))}
                    className="p-1 rounded-full bg-white border border-gray-300 hover:bg-gray-200 transition disabled:opacity-50"
                    disabled={editGuests >= booking.venue.maxGuests}
                  >
                    <FaPlus className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Maximum {booking.venue.maxGuests} guests</p>
              </div>
              {editError && <div className="text-red-500 text-sm">{editError}</div>}
              <button
                type="submit"
                className="w-full bg-[#0C5560] text-white py-3 px-4 rounded-lg hover:bg-[#094147] transition-colors duration-300 disabled:opacity-50"
                disabled={editLoading}
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 