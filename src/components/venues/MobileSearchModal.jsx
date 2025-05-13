import { FaSearch } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/datepicker-teal.css';

export default function MobileSearchModal({
  open, onClose, where, setWhere, checkIn, setCheckIn, checkOut, setCheckOut, guests, setGuests, handleSubmit
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md mx-auto rounded-2xl shadow-xl p-6 relative flex flex-col">
        <button className="absolute top-3 right-3 text-2xl text-gray-400" onClick={onClose} aria-label="Close">&times;</button>
        <h2 className="text-xl font-bold mb-4">Search</h2>
        <form onSubmit={e => { handleSubmit(e); onClose(); }} className="flex flex-col gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Where</label>
            <input
              type="text"
              placeholder="Search destinations"
              value={where}
              onChange={e => setWhere(e.target.value)}
              className="w-full bg-gray-100 rounded-lg px-3 py-2 outline-none text-gray-700 placeholder-gray-400 text-base"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Check in</label>
            <DatePicker
              selected={checkIn}
              onChange={date => {
                setCheckIn(date);
                if (checkOut && date && date >= checkOut) {
                  setCheckOut(null);
                }
              }}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              placeholderText="Select date"
              className="w-full bg-gray-100 rounded-lg px-3 py-2 outline-none text-gray-700 placeholder-gray-400 text-base"
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              aria-label="Check in date"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Check out</label>
            <DatePicker
              selected={checkOut}
              onChange={date => setCheckOut(date)}
              selectsEnd
              startDate={checkIn}
              endDate={checkOut}
              minDate={checkIn || new Date()}
              placeholderText="Select date"
              className="w-full bg-gray-100 rounded-lg px-3 py-2 outline-none text-gray-700 placeholder-gray-400 text-base"
              dateFormat="dd/MM/yyyy"
              aria-label="Check out date"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Guests</label>
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
              className="w-full bg-gray-100 rounded-lg px-3 py-2 outline-none text-gray-700 placeholder-gray-400 text-base"
              inputMode="numeric"
            />
          </div>
          <button type="submit" className="w-full bg-[#0C5560] text-white rounded-xl p-3 shadow-md hover:bg-[#094147] transition font-semibold text-lg flex items-center justify-center gap-2 mt-2">
            <FaSearch size={22} /> Search
          </button>
        </form>
      </div>
    </div>
  );
} 