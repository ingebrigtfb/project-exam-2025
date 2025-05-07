import PropTypes from 'prop-types';
import { CiHeart } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';

const VenueCard = ({ venue }) => {
  const navigate = useNavigate();

  const imageUrl =
    Array.isArray(venue.media) &&
    venue.media.length > 0 &&
    venue.media[0]?.url &&
    venue.media[0].url.trim() !== ''
      ? venue.media[0].url
      : 'https://placehold.co/300x200?text=No+Image';

  return (
    <div className="bg-white rounded-lg shadow w-[298px] h-[300px] flex flex-col">
      <div className="relative">
        <img
          src={imageUrl}
          alt={venue.media && venue.media[0]?.alt ? venue.media[0].alt : venue.name} 
          className="rounded-t-md w-full h-42 object-cover"
        />
        <button className="absolute top-2 right-2 bg-white/70 rounded-full p-1 shadow transition">
          <CiHeart size={24} color="#0C5560" />
        </button>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-sm mb-1 truncate">{venue.name}</h3>
        <p className="text-xs text-gray-600 mb-3 overflow-hidden text-ellipsis line-clamp-3">
          {venue.description}
        </p>
        <button
          className="block w-fit mx-auto border border-[#0C5560] text-[#0C5560] rounded py-1 px-7 transition hover:bg-[#0C5560] hover:text-white font-medium mt-auto"
          onClick={() => navigate(`/venues/${venue.id}`)}
        >
          Book
        </button>
      </div>
    </div>
  );
};

VenueCard.propTypes = {
  venue: PropTypes.object.isRequired,
};

export default VenueCard;
