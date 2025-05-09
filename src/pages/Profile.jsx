import { useState } from 'react';
import ProfileBanner from '../components/profile/ProfileBanner';
import ProfileAvatar from '../components/profile/ProfileAvatar';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileTabs from '../components/profile/ProfileTabs';

function AccountSettings({ user, setUser }) {
  const [venueManager, setVenueManager] = useState(!!user.venueManager);

  const handleToggle = () => {
    const updated = { ...user, venueManager: !venueManager };
    setVenueManager(!venueManager);
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <div className="max-w-md mx-auto mt-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <span className="font-medium">Venue manager</span>
        <button
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${venueManager ? 'bg-[#0C5560]' : 'bg-gray-300'}`}
          onClick={handleToggle}
          aria-pressed={venueManager}
        >
          <span
            className={`h-4 w-4 bg-white rounded-full shadow transform transition-transform duration-200 ${venueManager ? 'translate-x-6' : 'translate-x-0'}`}
          />
        </button>
      </div>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        onClick={handleLogout}
      >
        Log out
      </button>
    </div>
  );
}

export default function Profile() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [activeTab, setActiveTab] = useState('bookings');

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
          {activeTab === 'bookings' && (
            null
          )}
          {activeTab === 'settings' && (
            <AccountSettings user={user} setUser={setUser} />
          )}
          {/* Add similar sections for venues, favorites, settings as needed */}
        </div>
      </div>
    </div>
  );
}
