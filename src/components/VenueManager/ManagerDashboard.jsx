import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyVenueCard from '../cards/MyVenueCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaPlus, FaCalendarAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import VenueBookings from './VenueBookings';

export default function ManagerDashboard({ user }) {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('venues');
  const [expandedVenues, setExpandedVenues] = useState({});
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

  const toggleVenueExpand = (venueId) => {
    setExpandedVenues(prev => ({
      ...prev,
      [venueId]: !prev[venueId]
    }));
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'venues' ? 'text-[#0C5560] border-b-2 border-[#0C5560]' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('venues')}
        >
          My Venues
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm flex items-center gap-1 ${activeTab === 'bookings' ? 'text-[#0C5560] border-b-2 border-[#0C5560]' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('bookings')}
        >
          <FaCalendarAlt className="h-3.5 w-3.5" />
          Venue Bookings
        </button>
      </div>

      {/* Create Venue Button */}
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

      {/* Content based on active tab */}
      {activeTab === 'venues' && (
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
      )}

      {activeTab === 'bookings' && (
        <div className="min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : venues.length === 0 ? (
            <div className="text-center text-gray-500 mt-24">You have not created any venues yet.</div>
          ) : (
            <div className="space-y-6">
              {venues.map(venue => (
                <div key={venue.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div 
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleVenueExpand(venue.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={venue.media?.[0]?.url || 'https://placehold.co/300x200?text=No+Image'}
                          alt={venue.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{venue.name}</h3>
                        <p className="text-sm text-gray-500">{venue.location?.city}, {venue.location?.country}</p>
                      </div>
                    </div>
                    <div>
                      {expandedVenues[venue.id] ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </div>
                  
                  {expandedVenues[venue.id] && (
                    <div className="p-4 border-t border-gray-100">
                      <VenueBookings venueId={venue.id} venueName={venue.name} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 