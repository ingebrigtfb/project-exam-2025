import { useState, useEffect } from 'react';
import { createBooking } from '../../api/fetchBookings';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { FaCalendarAlt, FaUsers, FaUserFriends, FaMinus, FaPlus } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/datepicker-teal.css';

export default function BookingForm({ venue }) {
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [guests, setGuests] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [venueBookings, setVenueBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenueBookings = async () => {
      try {
        const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venue.id}?_bookings=true`);
        const data = await response.json();
        if (data.data?.bookings) {
          setVenueBookings(data.data.bookings);
        }
      } catch (err) {
        console.error('Error fetching venue bookings:', err);
      }
    };

    fetchVenueBookings();
  }, [venue.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate dates
      if (!dateFrom || !dateTo) {
        throw new Error('Please select both check-in and check-out dates');
      }

      if (dateFrom >= dateTo) {
        throw new Error('Check-out date must be after check-in date');
      }

      // Check for overlap with existing bookings
      const isOverlap = venueBookings.some(booking => {
        const bookingStart = new Date(booking.dateFrom);
        const bookingEnd = new Date(booking.dateTo);
        // Overlap if (startA <= endB) && (startB <= endA)
        return (dateFrom <= bookingEnd) && (bookingStart <= dateTo);
      });
      if (isOverlap) {
        throw new Error('Selected dates overlap with an existing booking. Please choose another period.');
      }

      // Validate guests
      if (guests < 1) {
        throw new Error('Number of guests must be at least 1');
      }

      if (guests > venue.maxGuests) {
        throw new Error(`Maximum ${venue.maxGuests} guests allowed`);
      }

      const bookingData = {
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
        guests,
        venueId: venue.id
      };

      const created = await createBooking(bookingData);
      navigate('/booking-confirmation', { state: { booking: created, isEdit: false } });
    } catch (err) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to check if a date is booked
  const isDateBooked = (date) => {
    return venueBookings.some(booking => {
      const bookingStart = new Date(booking.dateFrom);
      const bookingEnd = new Date(booking.dateTo);
      return date >= bookingStart && date <= bookingEnd;
    });
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!dateFrom || !dateTo) return null;
    const nights = Math.ceil((dateTo - dateFrom) / (1000 * 60 * 60 * 24));
    return nights * venue.price;
  };

  const totalPrice = calculateTotalPrice();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Check-in date</label>
        <div className="relative">
          <DatePicker
            selected={dateFrom}
            onChange={date => setDateFrom(date)}
            selectsStart
            startDate={dateFrom}
            endDate={dateTo}
            minDate={new Date()}
            filterDate={date => !isDateBooked(date)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0C5560] focus:border-transparent"
            placeholderText="Select check-in date"
            dateFormat="dd/MM/yy"
            required
          />
          <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Check-out date</label>
        <div className="relative">
          <DatePicker
            selected={dateTo}
            onChange={date => setDateTo(date)}
            selectsEnd
            startDate={dateFrom}
            endDate={dateTo}
            minDate={dateFrom || new Date()}
            filterDate={date => !isDateBooked(date)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0C5560] focus:border-transparent"
            placeholderText="Select check-out date"
            dateFormat="dd/MM/yy"
            required
          />
          <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
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

      {totalPrice && (
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total price</p>
              <p className="text-lg font-bold text-[#0C5560]">${totalPrice}</p>
            </div>
            <p className="text-sm text-gray-500">
              {Math.ceil((dateTo - dateFrom) / (1000 * 60 * 60 * 24))} nights
            </p>
          </div>
        </div>
      )}

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={isLoading || !dateFrom || !dateTo}
        className="w-full bg-[#0C5560] text-white py-2 px-4 rounded-md hover:bg-[#094147] transition-colors duration-300 font-medium text-base disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Book Now'}
      </button>
    </form>
  );
} 