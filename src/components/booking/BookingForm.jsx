import { useState, useEffect } from 'react';
import { createBooking } from '../../api/fetchBookings';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { FaCalendarAlt, FaUserFriends, FaMinus, FaPlus, FaLock } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/datepicker-teal.css';
import { useAuth } from '../../contexts/AuthContext';

export default function BookingForm({ venue, venueBookings, onRequireAuth }) {
  const { user } = useAuth();
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [guests, setGuests] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const savedParams = localStorage.getItem('lastSearchParams');
    if (savedParams) {
      try {
        const { checkIn, checkOut, guests: savedGuests } = JSON.parse(savedParams);
        if (checkIn) {
          // Create date at noon to avoid timezone issues
          const date = new Date(checkIn);
          date.setHours(12, 0, 0, 0);
          setDateFrom(date);
        }
        if (checkOut) {
          // Create date at noon to avoid timezone issues
          const date = new Date(checkOut);
          date.setHours(12, 0, 0, 0);
          setDateTo(date);
        }
        if (savedGuests) setGuests(savedGuests);
      } catch (err) {
        console.error('Error parsing saved search parameters:', err);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      localStorage.removeItem('lastSearchParams');
    };
  }, []);

  useEffect(() => {
    if (user && showLoginMessage) {
      setShowLoginMessage(false);
    }
  }, [user, showLoginMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLoginMessage(true);

      return;
    }

    setError('');
    if (!dateFrom || !dateTo) {
      setError('Please select both check-in and check-out dates');
      return;
    }

    if (dateFrom >= dateTo) {
      setError('Check-out date must be after check-in date');
      return;
    }

    if (guests < 1) {
      setError('Number of guests must be at least 1');
      return;
    }

    if (guests > venue.maxGuests) {
      setError(`Maximum ${venue.maxGuests} guests allowed`);
      return;
    }

    setIsLoading(true);
    try {
      const booking = await createBooking({
        venueId: venue.id,
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
        guests
      });
      navigate(`/booking-confirmation/${booking.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isDateBooked = (date, isCheckIn = false) => {
    if (!venueBookings || !Array.isArray(venueBookings) || venueBookings.length === 0) return false;
    
    // Convert the date to midnight for comparison
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    // For check-out date selection, we need additional logic
    if (!isCheckIn && dateFrom && dateFrom < checkDate) {
      // We're selecting a check-out date after a check-in date is already selected
      // Need to verify there are no bookings between the check-in date and this potential check-out date
      for (const booking of venueBookings) {
        const bookingStart = new Date(booking.dateFrom);
        bookingStart.setHours(0, 0, 0, 0);
        
        const bookingEnd = new Date(booking.dateTo);
        bookingEnd.setHours(0, 0, 0, 0);
        
        // If the booking starts between our selected check-in and this potential check-out
        // OR if the booking ends between our selected check-in and this potential check-out
        // OR if the booking completely spans our selected period
        if (
          (bookingStart >= dateFrom && bookingStart < checkDate) || 
          (bookingEnd > dateFrom && bookingEnd <= checkDate) ||
          (bookingStart <= dateFrom && bookingEnd >= checkDate)
        ) {
          return true; // Date is not available
        }
      }
      return false; // No conflict found, date is available
    }
    
    // For check-in date selection or when no check-in date is selected yet
    return venueBookings.some(booking => {
      // Convert booking dates to local midnight
      const bookingStart = new Date(booking.dateFrom);
      bookingStart.setHours(0, 0, 0, 0);
      
      const bookingEnd = new Date(booking.dateTo);
      bookingEnd.setHours(0, 0, 0, 0);
      
      // Check if the date falls within any booking period
      return checkDate >= bookingStart && checkDate <= bookingEnd;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
          <DatePicker
            selected={dateFrom}
            onChange={date => {
              if (date) {
                date.setHours(12, 0, 0, 0);
                
                // Check if there are any bookings between the new check-in date and the current check-out date
                const shouldResetCheckout = dateTo && venueBookings && Array.isArray(venueBookings) && 
                  venueBookings.some(booking => {
                    const bookingStart = new Date(booking.dateFrom);
                    bookingStart.setHours(0, 0, 0, 0);
                    
                    const bookingEnd = new Date(booking.dateTo);
                    bookingEnd.setHours(0, 0, 0, 0);
                    
                    // Check if any part of this booking is between new check-in and current check-out
                    return (
                      (bookingStart >= date && bookingStart < dateTo) || 
                      (bookingEnd > date && bookingEnd <= dateTo) ||
                      (bookingStart <= date && bookingEnd >= dateTo)
                    );
                  });
                
                setDateFrom(date);
                
                // Reset check-out date if it's before or equal to the new check-in date
                // OR if there are bookings between the new check-in and current check-out
                if (dateTo && (date >= dateTo || shouldResetCheckout)) {
                  setDateTo(null);
                }
              } else {
                setDateFrom(null);
              }
            }}
            selectsStart
            startDate={dateFrom}
            endDate={dateTo}
            minDate={new Date()}
            filterDate={date => !isDateBooked(date, true)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0C5560] focus:border-transparent"
            placeholderText="Select check-in date"
            dateFormat="dd/MM/yy"
            required
            calendarStartDay={1}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
          <DatePicker
            selected={dateTo}
            onChange={date => {
              if (date) {
                date.setHours(12, 0, 0, 0);
                setDateTo(date);
              } else {
                setDateTo(null);
              }
            }}
            selectsEnd
            startDate={dateFrom}
            endDate={dateTo}
            minDate={dateFrom || new Date()}
            filterDate={date => !isDateBooked(date, false)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0C5560] focus:border-transparent"
            placeholderText="Select check-out date"
            dateFormat="dd/MM/yy"
            required
            calendarStartDay={1}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of guests</label>
          <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
            <FaUserFriends className="text-xl text-[#0C5560]" />
            <button
              type="button"
              aria-label="Decrease guests"
              onClick={() => setGuests(Math.max(1, guests - 1))}
              className="p-1 rounded-full bg-white border border-gray-300 hover:bg-gray-200 transition disabled:opacity-50"
              disabled={guests <= 1}
            >
              <FaMinus className="h-4 w-4" />
            </button>
            <input
              type="number"
              value={guests}
              onChange={e => {
                const val = parseInt(e.target.value);
                if (!isNaN(val)) setGuests(val);
              }}
              min="1"
              max={venue.maxGuests}
              className="w-12 text-center bg-transparent outline-none text-base font-semibold"
              required
            />
            <button
              type="button"
              aria-label="Increase guests"
              onClick={() => setGuests(Math.min(venue.maxGuests, guests + 1))}
              className="p-1 rounded-full bg-white border border-gray-300 hover:bg-gray-200 transition disabled:opacity-50"
              disabled={guests >= venue.maxGuests}
            >
              <FaPlus className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Maximum {venue.maxGuests} guests</p>
        </div>
      </div>

      {showLoginMessage && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-start">
          <FaLock className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
          <div className="w-full">
            <p className="text-blue-700 font-medium">Login required</p>
            <p className="text-blue-600 text-sm mt-1 mb-3">
              Please log in or register to book this venue. Your booking details will be saved.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#0C5560] text-white py-2 px-4 rounded-md hover:bg-[#094147] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Book Now'}
      </button>
    </form>
  );
}