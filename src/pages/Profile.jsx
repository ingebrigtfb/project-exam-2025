import { useState, useEffect } from 'react';
import ProfileBanner from '../components/profile/ProfileBanner';
import ProfileAvatar from '../components/profile/ProfileAvatar';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileTabs from '../components/profile/ProfileTabs';
import AccountSettings from '../components/profile/AccountSettings';
import FavoritesList from '../components/profile/FavoritesList';

export default function Profile() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [activeTab, setActiveTab] = useState('bookings');
  const favoritesKey = user ? `favorites_${user.name}` : null;
  const [favorites, setFavorites] = useState(() => {
    if (!favoritesKey) return [];
    try {
      return JSON.parse(localStorage.getItem(favoritesKey)) || [];
    } catch {
      return [];
    }
  });

  const saveFavorites = (fav) => {
    if (!favoritesKey) return;
    setFavorites(fav);
    localStorage.setItem(favoritesKey, JSON.stringify(fav));
  };

  const handleToggleFavorite = (venueId) => {
    const isFav = favorites.includes(venueId);
    const newFavs = isFav ? favorites.filter(id => id !== venueId) : [...favorites, venueId];
    saveFavorites(newFavs);
  };

  useEffect(() => {
    if (favoritesKey) {
      try {
        setFavorites(JSON.parse(localStorage.getItem(favoritesKey)) || []);
      } catch {
        setFavorites([]);
      }
    }
  }, [favoritesKey]);

  return (
    <div className="w-full">
      <ProfileBanner banner={user?.banner} />
      <div className="max-w-[1400px] mx-auto px-4 bg-white rounded mt-0 mb-12">
        <div className="relative">
          <ProfileAvatar avatar={user?.avatar} name={user?.name} />
        </div>
        <ProfileInfo
          name={user?.name}
          email={user?.email}
          bio={user?.bio}
          venueManager={user?.venueManager}
        />
        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div className="p-6">
          {activeTab === 'bookings' && null}
          {activeTab === 'favorites' && <FavoritesList user={user} favorites={favorites} onToggleFavorite={handleToggleFavorite} />}
          {activeTab === 'settings' && (
            <AccountSettings user={user} setUser={setUser} />
          )}
        </div>
      </div>
    </div>
  );
}
