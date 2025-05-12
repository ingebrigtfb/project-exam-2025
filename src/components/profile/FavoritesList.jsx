import { useEffect, useState } from 'react';
import VenueCard from '../VenueCard';

export default function FavoritesList({ user, favorites, onToggleFavorite }) {
  const [favoriteVenues, setFavoriteVenues] = useState([]);

  useEffect(() => {
    if (!user) return;
    const favoritesKey = `favorites_${user.name}`;
    let favoriteIds = favorites || [];
    if (!favoriteIds.length) {
      setFavoriteVenues([]);
      return;
    }
    Promise.all(
      favoriteIds.map(id =>
        fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`)
          .then(res => res.json())
          .then(data => data.data)
          .catch(() => null)
      )
    ).then(venues => setFavoriteVenues(venues.filter(Boolean)));
  }, [user, favorites]);

  if (!user) return null;

  return (
    <div>
      {favoriteVenues.length === 0 ? (
        <div className="text-center text-gray-500">No favorites yet.</div>
      ) : (
        <div className="flex flex-wrap gap-6 justify-start">
          {favoriteVenues.map(venue => (
            <VenueCard key={venue.id} venue={venue} isFavorite={true} onToggleFavorite={onToggleFavorite} />
          ))}
        </div>
      )}
    </div>
  );
} 