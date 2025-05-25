import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProfileBanner from '../components/profile/ProfileBanner';
import ProfileCard from '../components/profile/ProfileCard';
import ProfileTabs from '../components/profile/ProfileTabs';
import AccountSettings from '../components/profile/AccountSettings';
import FavoritesList from '../components/profile/FavoritesList';
import VenueManagerGuestMessage from '../components/profile/VenueManagerGuestMessage';
import ManagerDashboard from '../components/VenueManager/ManagerDashboard';
import BookingsList from '../components/profile/BookingsList';

export default function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    const tabFromUrl = searchParams.get('tab');
    return tabFromUrl || localStorage.getItem('profileActiveTab') || 'bookings';
  });
  const favoritesKey = user ? `favorites_${user.name}` : null;
  const [favorites, setFavorites] = useState(() => {
    if (!favoritesKey) return [];
    try {
      return JSON.parse(localStorage.getItem(favoritesKey)) || [];
    } catch {
      return [];
    }
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Update active tab when URL changes
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
      localStorage.setItem('profileActiveTab', tabFromUrl);
    } else if (activeTab) {
      // If no tab in URL but we have an active tab, update the URL
      setSearchParams({ tab: activeTab });
    }
  }, [searchParams, activeTab, setSearchParams]);

  const saveFavorites = (fav) => {
    if (!favoritesKey) return;
    setFavorites(fav);
    localStorage.setItem(favoritesKey, JSON.stringify(fav));
  };

  const handleToggleFavorite = (venueId, clearAll = false) => {
    if (clearAll) {
      saveFavorites([]);
      return;
    }
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

  // Persist active tab in localStorage and update URL
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('profileActiveTab', tab);
    setSearchParams({ tab });
    // Scroll to top when changing tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      <ProfileBanner banner={user?.banner} />
      <div className="max-w-[1400px] mx-auto px-4 relative z-10">
        <div className="md:flex md:gap-6 md:mt-6">
          {/* Left column - Profile Card */}
          <div className="md:w-1/3 lg:w-1/4">
            <ProfileCard user={user} />
          </div>
          
          {/* Right column - Tabs and Content */}
          <div className="mt-4 md:mt-0 md:flex-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <ProfileTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
              <div className="p-6">
                {activeTab === 'bookings' && <BookingsList />}
                {activeTab === 'venues' && !user?.venueManager && <VenueManagerGuestMessage />}
                {activeTab === 'venues' && user?.venueManager && <ManagerDashboard user={user} />}
                {activeTab === 'favorites' && <FavoritesList user={user} favorites={favorites} onToggleFavorite={handleToggleFavorite} />}
                {activeTab === 'settings' && (
                  <AccountSettings user={user} setUser={updateUser} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
