export default function VenueBooking({ venue }) {
  if (!venue) return null;
  return (
    <div className="w-full max-w-[1000px] mx-auto mt-8 flex justify-end md:px-0">
      <button className="w-50 md:w-auto px-6 py-3 bg-[#0C5560] text-white rounded-lg shadow hover:bg-[#094147] transition">
        Book this venue
      </button>
    </div>
  );
} 