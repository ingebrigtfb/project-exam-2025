import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import VenueHeader from '../components/venue-detail/VenueHeader';
import VenueInfo from '../components/venue-detail/VenueInfo';
import VenueBooking from '../components/venue-detail/VenueBooking';

const API_URL = 'https://v2.api.noroff.dev/holidaze/venues';

const VenueDetails = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenue = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.errors?.[0]?.message || 'Failed to fetch venue');
        setVenue(data.data);
        console.log('Venue:', data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id]);

  if (loading) return <div className="text-center py-16">Loading venue...</div>;
  if (error) return <div className="text-center text-red-500 py-16">{error}</div>;
  if (!venue) return null;

  return (
    <div className="pb-16 px-4">
      <VenueHeader venue={venue} />
      <div className="w-full max-w-[1000px] mx-auto mt-6 flex flex-col md:flex-row gap-4 md:gap-8 md:px-0">
        <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-8">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700 mb-4">{venue.description || 'No description provided.'}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div><span className="font-medium">Price:</span> ${venue.price}</div>
            <div><span className="font-medium">Max guests:</span> {venue.maxGuests}</div>
          </div>
          <VenueBooking venue={venue} />
        </div>
        <div className="w-full md:w-64 pt-4 md:pt-0 md:pl-8">
          <h2 className="text-xl font-semibold mb-2">Amenities</h2>
          <ul className="list-disc list-inside text-gray-700 bg-gray-50 rounded p-4">
            {venue.meta?.wifi && <li>WiFi</li>}
            {venue.meta?.parking && <li>Parking</li>}
            {venue.meta?.breakfast && <li>Breakfast</li>}
            {venue.meta?.pets && <li>Pets allowed</li>}
            {!venue.meta?.wifi && !venue.meta?.parking && !venue.meta?.breakfast && !venue.meta?.pets && (
              <li>No amenities listed.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
