import { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaUserFriends, FaRegCalendarAlt, FaUndo, FaMinus, FaPlus } from 'react-icons/fa';
import northernlights from '../../assets/northernlights.jpeg';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/datepicker-teal.css';
import MobileSearchModal from './MobileSearchModal';

export default function BookingSearch({ onSearch }) {
  const [where, setWhere] = useState('');
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState('1');
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    let guestsNum = parseInt(guests, 10);
    if (isNaN(guestsNum) || guestsNum < 1) guestsNum = 1;
    
    // Set dates to noon to avoid timezone issues
    const checkInDate = checkIn ? new Date(checkIn) : null;
    const checkOutDate = checkOut ? new Date(checkOut) : null;
    if (checkInDate) checkInDate.setHours(12, 0, 0, 0);
    if (checkOutDate) checkOutDate.setHours(12, 0, 0, 0);

    const searchParams = {
      where,
      checkIn: checkInDate ? checkInDate.toISOString().split('T')[0] : '',
      checkOut: checkOutDate ? checkOutDate.toISOString().split('T')[0] : '',
      guests: guestsNum
    };
    // Save search parameters to localStorage
    localStorage.setItem('lastSearchParams', JSON.stringify(searchParams));
    onSearch?.(searchParams);
    setGuests(String(guestsNum)); 
  };

  const handleReset = () => {
    setWhere('');
    setCheckIn(null);
    setCheckOut(null);
    setGuests('1');
    onSearch?.({
      where: '',
      checkIn: '',
      checkOut: '',
      guests: 1
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div
        className="w-full max-w-[1100px] h-60 md:h-72 rounded-[20px] md:rounded-[56px] overflow-hidden flex items-center justify-center relative z-10 shadow-lg"
        style={{ background: `url(${northernlights}) center/cover no-repeat` }}
      >
        <h1 className="text-3xl md:text-5xl font-bold text-white text-center drop-shadow-lg tracking-wide">
          EXPLORE BEAUTIFUL PLACES
        </h1>
      </div>
      <div className="w-full md:hidden flex justify-center -mt-8 z-20 relative">
        <button
          className="w-full max-w-[400px] bg-white rounded-xl shadow-lg flex items-center px-4 py-3 text-left text-gray-500 text-base border border-gray-200"
          onClick={() => setModalOpen(true)}
        >
          <FaSearch className="mr-2 text-[#0C5560]" />
          <span>{where ? where : 'Where to?'}</span>
        </button>
      </div>
      <MobileSearchModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        where={where}
        setWhere={setWhere}
        checkIn={checkIn}
        setCheckIn={setCheckIn}
        checkOut={checkOut}
        setCheckOut={setCheckOut}
        guests={guests}
        setGuests={setGuests}
        handleSubmit={handleSubmit}
        onSearch={onSearch}
      />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[900px] bg-white rounded-2xl md:rounded-3xl shadow-lg flex flex-col md:flex-row items-stretch md:items-center px-2 sm:px-4 py-4 md:py-4 gap-4 md:gap-0 -mt-12 relative z-20 hidden md:flex"
        style={{ minHeight: 100 }}
      >
        <div className="flex-1 flex flex-col items-start md:items-start md:flex-row md:gap-2 border-b md:border-b-0 md:border-r border-gray-200 px-1 sm:px-2 md:px-6 py-2 md:py-0 w-full md:w-auto">
          <FaMapMarkerAlt className="text-2xl text-[#0C5560] mb-1 md:mb-0 md:mr-2" />
          <div>
            <div className="font-medium text-gray-700">Where</div>
            <input
              type="text"
              placeholder="Search"
              value={where}
              onChange={e => setWhere(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base"
              required
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col items-start md:items-start md:flex-row md:gap-2 border-b md:border-b-0 md:border-r border-gray-200 px-1 sm:px-2 md:px-6 py-2 md:py-0 w-full md:w-auto">
          <div>
            <div className="font-medium text-gray-700">Check in</div>
            <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-lg px-2 py-1 mt-1">
              <FaRegCalendarAlt className="text-xl text-[#0C5560]" />
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
                }}
                selectsStart
                startDate={checkIn}
                endDate={checkOut}
                placeholderText="Select date"
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base py-1"
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                aria-label="Check in date"
                required
              />
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-start md:items-start md:flex-row md:gap-2 border-b md:border-b-0 md:border-r border-gray-200 px-1 sm:px-2 md:px-6 py-2 md:py-0 w-full md:w-auto">
          <div>
            <div className="font-medium text-gray-700">Check out</div>
            <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-lg px-2 py-1 mt-1">
              <FaRegCalendarAlt className="text-xl text-[#0C5560]" />
              <DatePicker
                selected={checkOut}
                onChange={date => {
                  if (date) {
                    date.setHours(12, 0, 0, 0);
                    setCheckOut(date);
                  } else {
                    setCheckOut(null);
                  }
                }}
                selectsEnd
                startDate={checkIn}
                endDate={checkOut}
                minDate={checkIn || new Date()}
                placeholderText="Select date"
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base py-1"
                dateFormat="dd/MM/yyyy"
                aria-label="Check out date"
                required
              />
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-start md:items-start md:flex-row md:gap-2 px-1 sm:px-2 md:px-6 py-2 md:py-0 w-full md:w-auto">
          <FaUserFriends className="text-2xl text-[#0C5560] mb-1 md:mb-0 md:mr-2" />
          <div>
            <div className="font-medium text-gray-700">Guests</div>
            <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2 mt-1">
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
                required
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
        </div>
        <div className="flex gap-2 ml-0 md:ml-4 mt-2 md:mt-0">
          <button
            type="button"
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-700 transition flex items-center justify-center p-2"
            aria-label="Reset search"
          >
            <FaUndo size={20} />
          </button>
          <button
            type="submit"
            className="bg-[#0C5560] text-white rounded-xl p-3 shadow-md hover:bg-[#094147] transition flex items-center justify-center"
            aria-label="Search"
          >
            <FaSearch size={28} />
          </button>
        </div>
      </form>
    </div>
  );
} 