import { useState } from 'react';

export default function AccountSettings({ user, setUser }) {
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
        className="px-4 py-2 bg-red-500 text-white w-50 rounded hover:bg-red-600 transition"
        onClick={handleLogout}
      >
        Log out
      </button>
    </div>
  );
} 