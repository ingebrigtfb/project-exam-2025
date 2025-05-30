import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaWifi, FaParking, FaUtensils, FaPaw, FaUser, FaStar, FaRegStar, FaEdit, FaTrash, FaHeart } from 'react-icons/fa';
import { CiHeart } from 'react-icons/ci';
import ImageCarousel from '../components/imageCarousel/ImageCarousel';
import VenueBooking from '../components/venue-detail/VenueBooking';
import LoadingSpinner from '../components/common/LoadingSpinner';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';
import AuthModal from '../auth/components/AuthModal';
import { createBooking } from '../api/fetchBookings';

const API_URL = 'https://v2.api.noroff.dev/holidaze/venues';

const VenueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [venue, setVenue] = useState(null);
  const [venueBookings, setVenueBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    const checkIfFavorite = () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        const favoritesKey = `favorites_${user.name}`;
        try {
          const favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];
          setIsFavorite(favorites.includes(id));
        } catch {
          setIsFavorite(false);
        }
      }
    };

    checkIfFavorite();
  }, [id]);

  useEffect(() => {
    const fetchVenue = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/${id}?_owner=true`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.errors?.[0]?.message || 'Failed to fetch venue');
        setVenue(data.data);
        
        // After setting venue, fetch bookings
        fetchVenueBookings(data.data.id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id]);

  const fetchVenueBookings = async (venueId) => {
    try {
      const response = await fetch(`${API_URL}/${venueId}?_bookings=true`);
      const data = await response.json();
      if (response.ok && data.data?.bookings) {
        setVenueBookings(data.data.bookings);
      }
    } catch (err) {
      console.error('Error fetching venue bookings:', err);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.accessToken}`,
          'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY
        }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.errors?.[0]?.message || 'Failed to delete venue');
      }
      navigate('/profile');
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleEdit = () => {
    navigate(`/profile/edit-venue/${id}`);
  };

  const handleRequireAuth = (bookingData) => {
    setPendingBooking(bookingData);
    setShowAuthModal(true);
  };

  const handleAuthSuccess = async (userData) => {
    setShowAuthModal(false);
    if (pendingBooking) {
      try {
        const booking = await createBooking(pendingBooking);
        setPendingBooking(null);
        navigate(`/booking-confirmation/${booking.id}`);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleToggleFavorite = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const favoritesKey = `favorites_${user.name}`;
    try {
      const favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];
      let newFavorites;
      
      if (favorites.includes(id)) {
        newFavorites = favorites.filter(venueId => venueId !== id);
      } else {
        newFavorites = [...favorites, id];
      }
      
      localStorage.setItem(favoritesKey, JSON.stringify(newFavorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="min-h-[400px] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Venue not found</div>
      </div>
    );
  }

  const rating = Math.round(venue.rating || 0);
  const user = JSON.parse(localStorage.getItem('user'));
  const isOwner = user && venue.owner?.name === user.name;
  const cameFromProfile = location.state?.from === 'profile';

  const handleBack = () => {
    if (cameFromProfile) {
      navigate('/profile?tab=favorites');
    } else {
      navigate('/venues');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Venue"
        message="Are you sure you want to delete this venue? This action cannot be undone."
        itemName={venue?.name}
        isLoading={deleteLoading}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Venue Images */}
        <div className="mb-8">
          <ImageCarousel 
            images={venue.media} 
            defaultAlt={`${venue.name} images`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Venue Information */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-semibold">{venue.name}</h2>
                  {user && !isOwner && (
                    <button
                      className={`rounded-full p-1 shadow transition bg-white/70 ${isFavorite ? 'text-red-500' : 'text-[#0C5560]'}`}
                      onClick={handleToggleFavorite}
                      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {isFavorite ? <FaHeart size={24} color="#ef4444" /> : <CiHeart size={24} color="#0C5560" />}
                    </button>
                  )}
                </div>
                {isOwner && (
                  <div className="flex gap-2">
                    <button
                      className="bg-white/80 hover:bg-white rounded-full p-2 shadow text-[#0C5560] transition"
                      onClick={() => navigate(`/profile/edit-venue/${venue.id}`, { state: { from: location.state?.from } })}
                      title="Edit venue"
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      className="bg-white/80 hover:bg-white rounded-full p-2 shadow text-red-500 transition"
                      onClick={() => setShowDeleteModal(true)}
                      title="Delete venue"
                    >
                      <FaTrash size={20} />
                    </button>
                  </div>
                )}
              </div>
              {deleteError && (
                <div className="text-red-500 text-sm mb-4">{deleteError}</div>
              )}
              <div className="flex items-center gap-1 text-yellow-400 text-sm mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) =>
                    i < rating ? <FaStar key={i} className="w-4 h-4" /> : <FaRegStar key={i} className="w-4 h-4" />
                  )}
                </div>
                <span className="ml-1 text-gray-600 font-medium">{venue.rating?.toFixed(1) || '0.0'}</span>
              </div>
              <p className="text-gray-600 mb-6">{venue.description}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {venue.meta.wifi && (
                  <div className="flex items-center space-x-2">
                    <FaWifi className="text-gray-600" />
                    <span className="text-sm text-gray-600">WiFi</span>
                  </div>
                )}
                {venue.meta.parking && (
                  <div className="flex items-center space-x-2">
                    <FaParking className="text-gray-600" />
                    <span className="text-sm text-gray-600">Parking</span>
                  </div>
                )}
                {venue.meta.breakfast && (
                  <div className="flex items-center space-x-2">
                    <FaUtensils className="text-gray-600" />
                    <span className="text-sm text-gray-600">Breakfast</span>
                  </div>
                )}
                {venue.meta.pets && (
                  <div className="flex items-center space-x-2">
                    <FaPaw className="text-gray-600" />
                    <span className="text-sm text-gray-600">Pets Allowed</span>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Form - Mobile */}
            <div className="lg:hidden mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <VenueBooking 
                  venue={venue} 
                  venueBookings={venueBookings}
                  onRequireAuth={handleRequireAuth}
                  isOwner={isOwner}
                />
              </div>
            </div>

            {/* Venue Location */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-6">Location</h2>
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-gray-600" />
                <div>
                  <p className="font-medium">{venue.location.address}</p>
                  <p className="text-gray-600">
                    {venue.location.city}, {venue.location.zip}
                  </p>
                  <p className="text-gray-600">
                    {venue.location.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Venue Manager */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-6">Venue Manager</h2>
              <div className="flex items-center space-x-4">
                {venue.owner?.avatar ? (
                  <img 
                    src={venue.owner.avatar.url} 
                    alt={venue.owner.avatar.alt || venue.owner.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <FaUser className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <p className="font-medium text-lg">{venue.owner?.name || 'Unknown Manager'}</p>
              </div>
            </div>
          </div>

          {/* Booking Form - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8 z-10">
              <VenueBooking 
                venue={venue} 
                venueBookings={venueBookings}
                onRequireAuth={handleRequireAuth}
                isOwner={isOwner}
              />
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default VenueDetails;
