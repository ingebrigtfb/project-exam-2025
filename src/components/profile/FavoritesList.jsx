import { useEffect, useState } from 'react';
import VenueCard from '../cards/VenueCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaTrash } from 'react-icons/fa';

export default function FavoritesList({ user, favorites, onToggleFavorite }) {
  const [favoriteVenues, setFavoriteVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const favoritesKey = `favorites_${user.name}`;
    let favoriteIds = favorites || [];
    if (!favoriteIds.length) {
      setFavoriteVenues([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(
      favoriteIds.map(id =>
        fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`)
          .then(res => res.json())
          .then(data => data.data)
          .catch(() => null)
      )
    ).then(venues => {
      setFavoriteVenues(venues.filter(Boolean));
      setLoading(false);
    });
  }, [user, favorites]);

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all favorites? This action cannot be undone.')) {
      onToggleFavorite(null, true); // true indicates clear all
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (favoriteVenues.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-24">No favorites yet.</div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-end mb-6">
        <button
          onClick={handleClearAll}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          <FaTrash />
          Clear All
        </button>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-[1400px] mx-auto">
        {favoriteVenues.map(venue => (
          <VenueCard 
            key={venue.id} 
            venue={venue} 
            isFavorite={true} 
            onToggleFavorite={onToggleFavorite}
            fromFavorites={true}
          />
        ))}
      </div>
    </div>
  );
} 