import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaWifi, FaParking, FaUtensils, FaPaw, FaUser, FaStar, FaRegStar } from 'react-icons/fa';
import ImageCarousel from '../components/imageCarousel/ImageCarousel';
import VenueBooking from '../components/venue-detail/VenueBooking';
import LoadingSpinner from '../components/common/LoadingSpinner';

const API_URL = 'https://v2.api.noroff.dev/holidaze/venues';

const VenueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenue = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/${id}?_owner=true`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.errors?.[0]?.message || 'Failed to fetch venue');
        setVenue(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/venues')}
        className="mb-6 text-gray-600 hover:text-gray-800 transition-colors duration-300 flex items-center gap-2"
      >
        <FaArrowLeft className="h-5 w-5" />
        Back to Venues
      </button>

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
              <h1 className="text-3xl font-bold mb-2">{venue.name}</h1>
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

            {/* Booking Form - Moved here for mobile */}
            <div className="lg:hidden">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold mb-6">Book This Venue</h2>
                <VenueBooking venue={venue} />
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
              <h2 className="text-2xl font-semibold mb-6">Book This Venue</h2>
              <VenueBooking venue={venue} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
