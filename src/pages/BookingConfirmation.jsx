import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaWifi, FaParking, FaUtensils, FaPaw } from 'react-icons/fa';
import ImageCarousel from '../components/imageCarousel/ImageCarousel';
import { useState, useEffect, useRef } from 'react';
import { getBooking } from '../api/fetchBookings';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../auth/components/AuthModal';

export default function BookingConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const confirmationRef = useRef(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const editParam = searchParams.get('edit');
    setIsEdit(editParam === 'true' || (location.state && location.state.isEdit));
    
    const fetchBooking = async () => {
      try {
        const data = await getBooking(id);
        setBooking(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [id, location]);
  
  useEffect(() => {
    if (!isLoading && booking) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isLoading, booking]);

  const handleGoToBookings = () => {
    if (user) {
      navigate('/profile?tab=bookings');
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = (userData) => {
    login(userData);
    setAuthModalOpen(false);
    navigate('/profile?tab=bookings');
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-red-500 text-center">{error}</div>
      );
    }

    if (!booking) {
      return (
        <div className="text-center">No booking information found</div>
      );
    }

    if (!booking.venue) {
      return (
        <div className="text-center text-red-500">Error: Venue information is missing</div>
      );
    }

    // Helper function to format dates
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    return (
      <>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Message */}
          <div ref={confirmationRef} className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-semibold text-green-800 mb-2">
              {isEdit ? 'Booking Updated!' : 'Booking Confirmed!'}
            </h1>
            <p className="text-green-700 mb-4">
              {isEdit 
                ? 'Your booking has been successfully updated.'
                : 'Your booking has been successfully created.'
              } You can view all your bookings in the bookings section.
            </p>
            <button
              onClick={handleGoToBookings}
              className="bg-[#0C5560] text-white px-4 py-2 rounded-lg hover:bg-[#094147] transition-colors"
            >
              Go to Bookings
            </button>
          </div>

          {/* Venue Images */}
          {booking.venue.media && booking.venue.media.length > 0 && (
            <div className="mb-8">
              <ImageCarousel 
                images={booking.venue.media} 
                defaultAlt={`${booking.venue.name} images`}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Information */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold mb-6">Booking Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Check-in</p>
                      <p className="font-medium">{formatDate(booking.dateFrom)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Check-out</p>
                      <p className="font-medium">{formatDate(booking.dateTo)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaUsers className="text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Guests</p>
                      <p className="font-medium">{booking.guests} people</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Venue Location */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold mb-6">Location</h2>
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="text-gray-600" />
                  <div>
                    <p className="font-medium">{booking.venue.location.address}</p>
                    <p className="text-gray-600">
                      {booking.venue.location.city}, {booking.venue.location.zip}
                    </p>
                    <p className="text-gray-600">
                      {booking.venue.location.country}
                    </p>
                  </div>
                </div>
              </div>

              {/* Venue Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold mb-6">Venue Details</h2>
                <p className="text-gray-600 mb-6">{booking.venue.description}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {booking.venue.meta.wifi && (
                    <div className="flex items-center space-x-2">
                      <FaWifi className="text-gray-600" />
                      <span className="text-sm text-gray-600">WiFi</span>
                    </div>
                  )}
                  {booking.venue.meta.parking && (
                    <div className="flex items-center space-x-2">
                      <FaParking className="text-gray-600" />
                      <span className="text-sm text-gray-600">Parking</span>
                    </div>
                  )}
                  {booking.venue.meta.breakfast && (
                    <div className="flex items-center space-x-2">
                      <FaUtensils className="text-gray-600" />
                      <span className="text-sm text-gray-600">Breakfast</span>
                    </div>
                  )}
                  {booking.venue.meta.pets && (
                    <div className="flex items-center space-x-2">
                      <FaPaw className="text-gray-600" />
                      <span className="text-sm text-gray-600">Pets Allowed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Price Information */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-2xl font-semibold mb-6">Price Details</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per night</span>
                    <span className="font-medium">${booking.venue.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of nights</span>
                    <span className="font-medium">
                      {Math.ceil((new Date(booking.dateTo) - new Date(booking.dateFrom)) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold">
                        ${booking.venue.price * Math.ceil((new Date(booking.dateTo) - new Date(booking.dateFrom)) / (1000 * 60 * 60 * 24))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AuthModal 
          open={authModalOpen} 
          onClose={() => setAuthModalOpen(false)} 
          onSuccess={handleAuthSuccess}
          initialMode="login"
        />
      </>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4 mt-16">
        {renderContent()}
      </div>
    </Layout>
  );
} 