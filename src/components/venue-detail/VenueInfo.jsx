export default function VenueInfo({ venue }) {
  if (!venue) return null;
  return (
    <div className="w-full max-w-[1000px] mx-auto mt-6 flex flex-col md:flex-row gap-4 md:gap-8 md:px-0">
      <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-8">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700 mb-4">{venue.description || 'No description provided.'}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div><span className="font-medium">Price:</span> ${venue.price}</div>
          <div><span className="font-medium">Max guests:</span> {venue.maxGuests}</div>
        </div>
      </div>
      <div className="w-full md:w-64 pt-4 md:pt-0 md:pl-8">
        <h2 className="text-xl font-semibold mb-2">Amenities</h2>
        <ul className="list-disc list-inside text-gray-700 bg-gray-50 rounded p-4">
          {venue.meta?.wifi && <li>WiFi</li>}
          {venue.meta?.parking && <li>Parking</li>}
          {venue.meta?.breakfast && <li>Breakfast</li>}
          {venue.meta?.pets && <li>Pets allowed</li>}
          {!venue.meta?.wifi && !venue.meta?.parking && !venue.meta?.breakfast && !venue.meta?.pets && (
            <li>No amenities listed.</li>
          )}
        </ul>
      </div>
    </div>
  );
} 