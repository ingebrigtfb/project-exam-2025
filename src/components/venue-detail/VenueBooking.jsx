import BookingForm from '../booking/BookingForm';

export default function VenueBooking({ venue }) {
  if (!venue) return null;
  return (
    <div className="w-full max-w-[220px] mt-8">
      <BookingForm venue={venue} />
    </div>
  );
} 