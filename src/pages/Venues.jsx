import { useEffect, useState } from 'react';
import { fetchVenues } from '../api/fetchVenues';
import VenueCard from '../components/VenueCard';

const VENUES_PER_PAGE = 12;

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [page, setPage] = useState(1);
  const [totalVenues, setTotalVenues] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadVenues = async (pageNum = page) => {
    setLoading(true);
    const newVenues = await fetchVenues(pageNum, VENUES_PER_PAGE);
    setVenues(newVenues);
    setLoading(false);
  };

  // Fetch total venues count on mount
  useEffect(() => {
    const fetchTotal = async () => {
      // Try to get total from API, or fallback to a fixed number
      try {
        const res = await fetch('https://v2.api.noroff.dev/holidaze/venues');
        const data = await res.json();
        setTotalVenues(data.meta?.totalCount || 0);
      } catch {
        setTotalVenues(100); // fallback
      }
    };
    fetchTotal();
  }, []);

  useEffect(() => {
    loadVenues(page);
    // eslint-disable-next-line
  }, [page]);

  const totalPages = Math.ceil(totalVenues / VENUES_PER_PAGE);

  return (
    <div className="flex flex-col items-center py-8">
      <div className="flex flex-wrap gap-6 justify-center">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
      {/* Paginator */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-4 py-2 rounded border ${page === i + 1 ? 'bg-[#0C5560] text-white' : 'bg-white text-[#0C5560]'} hover:bg-[#094147] hover:text-white transition`}
              onClick={() => setPage(i + 1)}
              disabled={loading || page === i + 1}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Venues;

