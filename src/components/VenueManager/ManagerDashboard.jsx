import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyVenueCard from '../cards/MyVenueCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaPlus } from 'react-icons/fa';

export default function ManagerDashboard({ user }) {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.name) return;
    const fetchVenues = async () => {
      setLoading(true);
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        const res = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${user.name}/venues`, {
          headers: {
            Authorization: `Bearer ${userData.accessToken}`,
            'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY,
          },
        });
        const data = await res.json();
        setVenues(data.data || []);
      } catch {
        setVenues([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, [user]);

  const handleDeleteVenue = async (venueId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const res = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venueId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userData.accessToken}`,
          'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY,
        },
      });
      if (!res.ok) throw new Error('Failed to delete venue');
      setVenues(prev => prev.filter(venue => venue.id !== venueId));
    } catch (error) {
      console.error('Error deleting venue:', error);
      alert('Failed to delete venue. Please try again.');
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          className="group bg-[#0C5560] text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-[#094147] transition-all duration-300 flex items-center overflow-hidden"
          onClick={() => navigate('/profile/create-venue')}
          style={{ minWidth: 48 }}
        >
          <FaPlus className="transition-transform duration-300 group-hover:rotate-90" />
          <span className="hover:ml-2 opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
            Create Venue
          </span>
        </button>
      </div>
      <div className="min-h-[300px] flex items-center justify-center">
        {loading ? (
          <LoadingSpinner />
        ) : venues.length === 0 ? (
          <div className="text-center text-gray-500 mt-24">You have not created any venues yet.</div>
        ) : (
          <div className="w-full flex justify-center mt-0">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-[1400px] mx-auto">
              {venues.map(venue => (
                <MyVenueCard
                  key={venue.id}
                  venue={venue}
                  onDelete={handleDeleteVenue}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 