import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaWifi, FaParking, FaUtensils, FaPaw } from 'react-icons/fa';
import ImageCarousel from '../components/imageCarousel/ImageCarousel';

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">No booking information found</div>
      </div>
    );
  }

  if (!booking.venue) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">Error: Venue information is missing</div>
      </div>
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
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/bookings')}
        className="mb-6 text-gray-600 hover:text-gray-800 transition-colors duration-300 flex items-center gap-2"
      >
        <FaArrowLeft className="h-5 w-5" />
        Back to Bookings
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-green-800 mb-2">Booking Confirmed!</h1>
          <p className="text-green-700">
            Your booking has been successfully {location.state?.isEdit ? 'updated' : 'created'}. 
            You can view all your bookings in the bookings section.
          </p>
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
    </div>
  );
} 