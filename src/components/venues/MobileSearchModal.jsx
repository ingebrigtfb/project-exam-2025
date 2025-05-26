import { useState, useEffect } from 'react';
import { FaSearch, FaUndo, FaUserFriends, FaMinus, FaPlus, FaLock } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/datepicker-teal.css';

export default function MobileSearchModal({
  open, onClose, where, setWhere, checkIn, setCheckIn, checkOut, setCheckOut, 
  guests, setGuests, handleSubmit, onSearch, dateError, setDateError, showLoginMessage, onRequireAuth
}) {
  if (!open) return null;

  // Local validation for mobile form
  const validateAndSubmit = (e) => {
    e.preventDefault();
    
    // Validate that if one date is filled, both must be filled
    if ((checkIn && !checkOut) || (!checkIn && checkOut)) {
      setDateError('Both check-in and check-out dates must be selected');
      return;
    }
    
    // Set dates to noon to avoid timezone issues
    const checkInDate = checkIn ? new Date(checkIn) : null;
    const checkOutDate = checkOut ? new Date(checkOut) : null;
    if (checkInDate) checkInDate.setHours(12, 0, 0, 0);
    if (checkOutDate) checkOutDate.setHours(12, 0, 0, 0);

    const searchParams = {
      where,
      checkIn: checkInDate ? checkInDate.toISOString().split('T')[0] : '',
      checkOut: checkOutDate ? checkOutDate.toISOString().split('T')[0] : '',
      guests: parseInt(guests, 10)
    };
    localStorage.setItem('lastSearchParams', JSON.stringify(searchParams));
    handleSubmit(e); 
    onClose();
  };

  const handleReset = () => {
    // Clear all the values
    setWhere('');
    setCheckIn(null);
    setCheckOut(null);
    setGuests('1');
    setDateError('');
    
    onSearch?.({
      where: '',
      checkIn: '',
      checkOut: '',
      guests: 1
    });
    
    // Close the modal
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md mx-auto rounded-2xl shadow-xl p-6 relative flex flex-col">
        <button className="absolute top-3 right-3 text-3xl text-gray-400" onClick={onClose} aria-label="Close">&times;</button>
        <h2 className="text-xl font-bold mb-4">Search</h2>
        <form onSubmit={validateAndSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Where</label>
            <input
              type="text"
              placeholder="Search destinations"
              value={where}
              onChange={e => setWhere(e.target.value)}
              className="w-full bg-gray-100 rounded-lg px-3 py-2 outline-none text-gray-700 placeholder-gray-400 text-base"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Check in</label>
            <DatePicker
              selected={checkIn}
              onChange={date => {
                if (date) {
                  date.setHours(12, 0, 0, 0);
                  setCheckIn(date);
                  if (checkOut && date >= checkOut) {
                    setCheckOut(null);
                  }
                } else {
                  setCheckIn(null);
                }
                setDateError('');
              }}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              placeholderText="Select date"
              className="w-full bg-gray-100 rounded-lg px-3 py-2 outline-none text-gray-700 placeholder-gray-400 text-base"
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              aria-label="Check in date"
              required={!!checkOut}
              calendarStartDay={1}
              popperClassName="booking-calendar-popper"
              calendarClassName="react-datepicker-centered"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Check out</label>
            <DatePicker
              selected={checkOut}
              onChange={date => {
                if (date) {
                  date.setHours(12, 0, 0, 0);
                  setCheckOut(date);
                } else {
                  setCheckOut(null);
                }
                setDateError('');
              }}
              selectsEnd
              startDate={checkIn}
              endDate={checkOut}
              minDate={checkIn || new Date()}
              placeholderText="Select date"
              className="w-full bg-gray-100 rounded-lg px-3 py-2 outline-none text-gray-700 placeholder-gray-400 text-base"
              dateFormat="dd/MM/yyyy"
              aria-label="Check out date"
              required={!!checkIn}
              calendarStartDay={1}
              popperClassName="booking-calendar-popper"
              calendarClassName="react-datepicker-centered"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Guests</label>
            <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
              <FaUserFriends className="text-xl text-[#0C5560]" />
              <button
                type="button"
                aria-label="Decrease guests"
                onClick={() => setGuests(Math.max(1, parseInt(guests) - 1).toString())}
                className="p-1 rounded-full bg-white border border-gray-300 hover:bg-gray-200 transition disabled:opacity-50"
                disabled={parseInt(guests) <= 1}
              >
                <FaMinus className="h-4 w-4" />
              </button>
              <input
                type="number"
                min={1}
                value={guests}
                onChange={e => {
                  const val = e.target.value;
                  if (val === '' || /^[0-9]+$/.test(val)) {
                    setGuests(val);
                  }
                }}
                className="w-12 text-center bg-transparent outline-none text-base font-semibold"
                inputMode="numeric"
              />
              <button
                type="button"
                aria-label="Increase guests"
                onClick={() => setGuests((parseInt(guests) + 1).toString())}
                className="p-1 rounded-full bg-white border border-gray-300 hover:bg-gray-200 transition"
              >
                <FaPlus className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {dateError && (
            <div className="text-red-500 text-sm">
              {dateError}
            </div>
          )}
          
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 text-gray-500 hover:text-gray-700 transition font-medium text-base flex items-center justify-center gap-2 py-2"
            >
              <FaUndo size={18} /> Clear
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#0C5560] text-white rounded-xl p-2 shadow-md hover:bg-[#094147] transition font-semibold text-lg flex items-center justify-center gap-2"
            >
              <FaSearch size={22} /> Search
            </button>
          </div>
        </form>
        {showLoginMessage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-start">
            <FaLock className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
            <div className="w-full">
              <p className="text-blue-700 font-medium">Login required</p>
              <p className="text-blue-600 text-sm mt-1 mb-3">
                Please log in or register to book this venue. Your booking details will be saved.
              </p>
              <button
                type="button"
                onClick={() => {
                  onRequireAuth?.({
                    venueId: venue.id,
                    dateFrom: dateFrom?.toISOString(),
                    dateTo: dateTo?.toISOString(),
                    guests
                  });
                }}
                className="bg-[#0C5560] text-white px-4 py-2 rounded-lg hover:bg-[#094147] transition-colors text-sm"
              >
                Login or Register
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 