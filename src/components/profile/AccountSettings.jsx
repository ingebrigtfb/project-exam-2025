import { useState } from 'react';
import { updateProfile } from '../../api/fetchUpdateProfile';

export default function AccountSettings({ user, setUser }) {
  const [venueManager, setVenueManager] = useState(!!user.venueManager);
  const [bio, setBio] = useState(user.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatar?.url || '');
  const [bannerUrl, setBannerUrl] = useState(user.banner?.url || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleToggle = () => {
    const updated = { ...user, venueManager: !venueManager };
    setVenueManager(!venueManager);
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate URLs if provided
      if (avatarUrl && !isValidUrl(avatarUrl)) {
        throw new Error('Avatar URL must be a valid, fully formed URL');
      }
      if (bannerUrl && !isValidUrl(bannerUrl)) {
        throw new Error('Banner URL must be a valid, fully formed URL');
      }

      const updateData = {
        bio: bio || null,
        avatar: avatarUrl ? {
          url: avatarUrl,
          alt: `${user.name}'s avatar`
        } : null,
        banner: bannerUrl ? {
          url: bannerUrl,
          alt: `${user.name}'s banner`
        } : null,
        venueManager
      };

      const updatedProfile = await updateProfile(user.name, updateData);
      
      // Update local storage and state
      const updatedUser = { ...user, ...updatedProfile };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to validate URLs
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="bio" className="font-medium">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#0C5560]"
            rows="3"
            placeholder="Tell us about yourself..."
            maxLength={159}
          />
          <div className="text-sm text-gray-500 text-right">
            {bio.length}/159 characters
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="avatar" className="font-medium">Avatar URL</label>
          <input
            id="avatar"
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#0C5560]"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="banner" className="font-medium">Banner URL</label>
          <input
            id="banner"
            type="url"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#0C5560]"
            placeholder="https://example.com/banner.jpg"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">Venue manager</span>
          <button
            type="button"
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${venueManager ? 'bg-[#0C5560]' : 'bg-gray-300'}`}
            onClick={handleToggle}
            aria-pressed={venueManager}
          >
            <span
              className={`h-4 w-4 bg-white rounded-full shadow transform transition-transform duration-200 ${venueManager ? 'translate-x-6' : 'translate-x-0'}`}
            />
          </button>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-500 text-sm">{success}</div>}

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-[#0C5560] text-white rounded hover:bg-[#094147] transition disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </form>
    </div>
  );
} 