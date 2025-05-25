import BookingForm from '../booking/BookingForm';

export default function VenueBooking({ venue, venueBookings, onRequireAuth, isOwner }) {
  if (!venue) return null;
  return (
    <div className="w-full">
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-[#0C5560]">${venue.price}</span>
          <span className="text-gray-600">per night</span>
        </div>
      </div>
      <BookingForm 
        venue={venue} 
        venueBookings={venueBookings} 
        onRequireAuth={onRequireAuth} 
        isOwner={isOwner}
      />
    </div>
  );
} 