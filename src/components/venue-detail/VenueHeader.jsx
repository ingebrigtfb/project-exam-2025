import ImageCarousel from '../imageCarousel/ImageCarousel';

export default function VenueHeader({ venue }) {
  if (!venue) return null;
  return (
    <div className="w-full max-w-[1000px] mx-auto mt-8 md:px-0">
      <ImageCarousel images={venue.media} defaultAlt={`${venue.name} image`} />
      <div className="flex flex-col md:flex-row md:items-center mt-4 md:justify-between gap-2 md:gap-1">
        <div className="flex items-center gap-3 mb-1 md:mb-0 flex-wrap">
          <h1 className="text-3xl font-bold">{venue.name}</h1>
        </div>
        <div className="text-gray-600 text-lg mt-2 md:mt-0">{venue.location?.city}, {venue.location?.country}</div>
      </div>
    </div>
  );
} 