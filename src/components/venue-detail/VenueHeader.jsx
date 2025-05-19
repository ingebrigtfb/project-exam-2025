import { FaStar, FaRegStar } from 'react-icons/fa';
import ImageCarousel from '../imageCarousel/ImageCarousel';

export default function VenueHeader({ venue }) {
  if (!venue) return null;
  const rating = Math.round(venue.rating || 0);
  return (
    <div className="w-full max-w-[1000px] mx-auto mt-8 md:px-0">
      <ImageCarousel images={venue.media} defaultAlt={`${venue.name} image`} />
      <div className="flex flex-col md:flex-row md:items-center mt-4 md:justify-between gap-2 md:gap-1">
        <div className="flex items-center gap-3 mb-1 md:mb-0 flex-wrap">
          <h1 className="text-3xl font-bold mr-2">{venue.name}</h1>
          <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-lg shadow-sm">
            <div className="flex items-center gap-0.5 text-yellow-400">
              {[...Array(5)].map((_, i) =>
                i < rating ? <FaStar key={i} /> : <FaRegStar key={i} />
              )}
            </div>
            <span className="ml-1 text-gray-800 text-base font-semibold">{venue.rating?.toFixed(1) || '0.0'}</span>
          </div>
        </div>
        <div className="text-gray-600 text-lg mt-2 md:mt-0">{venue.location?.city}, {venue.location?.country}</div>
      </div>
    </div>
  );
} 