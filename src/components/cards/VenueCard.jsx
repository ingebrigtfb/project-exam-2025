import PropTypes from 'prop-types';
import { CiHeart } from 'react-icons/ci';
import { FaHeart } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const VenueCard = ({ venue, isFavorite, onToggleFavorite, onRequireAuth, fromFavorites }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const imageUrl =
    Array.isArray(venue.media) &&
    venue.media.length > 0 &&
    venue.media[0]?.url &&
    venue.media[0].url.trim() !== ''
      ? venue.media[0].url
      : 'https://placehold.co/300x200?text=No+Image';

  const handleClick = () => {
    // Determine if we're coming from the profile page's favorites tab
    const isFromProfileFavorites = fromFavorites || 
      (location.pathname === '/profile' && location.search?.includes('tab=favorites'));
    
    navigate(`/venues/${venue.id}`, { 
      state: { from: isFromProfileFavorites ? 'profile' : 'venues' }
    });
  };

  return (
    <div 
      className="bg-white rounded-lg shadow w-full max-w-[320px] mx-auto min-h-[220px] flex flex-col cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-lg"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={venue.media && venue.media[0]?.alt ? venue.media[0].alt : venue.name} 
          className="rounded-t-md w-full h-42 object-cover"
        />
        {user && (
          <button
            className={`absolute top-2 right-2 rounded-full p-1 shadow transition bg-white/70 ${isFavorite ? 'text-red-500' : 'text-[#0C5560]'}`}
            onClick={e => {
              e.stopPropagation();
              if (onToggleFavorite) onToggleFavorite(venue.id);
              else if (onRequireAuth) onRequireAuth();
            }}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? <FaHeart size={24} color="#ef4444" /> : <CiHeart size={24} color="#0C5560" />}
          </button>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-sm mb-1 truncate">{venue.name}</h3>
        <p className="text-xs text-gray-600 mb-3 overflow-hidden text-ellipsis line-clamp-3">
          {venue.description}
        </p>
        <div className="mt-auto text-right">
          <span className="text-[#0C5560] font-semibold">${venue.price}</span>
          <span className="text-gray-500 text-sm"> / night</span>
        </div>
      </div>
    </div>
  );
};

VenueCard.propTypes = {
  venue: PropTypes.object.isRequired,
  isFavorite: PropTypes.bool,
  onToggleFavorite: PropTypes.func,
  onRequireAuth: PropTypes.func,
  fromFavorites: PropTypes.bool
};

export default VenueCard;
