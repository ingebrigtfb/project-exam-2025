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
      <VenueInfo venue={venue} />
      <VenueBooking venue={venue} />
    </div>
  );
};

export default VenueDetails;
