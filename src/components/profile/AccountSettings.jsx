import { useState } from 'react';
import { updateProfile } from '../../api/fetchUpdateProfile';
import { FaUserEdit, FaImage, FaUserCog } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AccountSettings({ user, setUser }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [venueManager, setVenueManager] = useState(!!user.venueManager);
  const [bio, setBio] = useState(user.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatar?.url || '');
  const [avatarAlt, setAvatarAlt] = useState(user.avatar?.alt || `${user.name}'s profile image`);
  const [bannerUrl, setBannerUrl] = useState(user.banner?.url || '');
  const [bannerAlt, setBannerAlt] = useState(user.banner?.alt || `${user.name}'s banner`);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleToggle = () => {
    const updated = { ...user, venueManager: !venueManager };
    setVenueManager(!venueManager);
    setUser(updated);
  };

  const handleAvatarUrlChange = (e) => {
    const url = e.target.value;
    setAvatarUrl(url);
    if (url && avatarAlt === `${user.name}'s profile image`) {
      // Only auto-update alt text if it's still the default
      setAvatarAlt(`${user.name}'s profile image`);
    }
  };

  const handleBannerUrlChange = (e) => {
    const url = e.target.value;
    setBannerUrl(url);
    if (url && bannerAlt === `${user.name}'s banner`) {
      // Only auto-update alt text if it's still the default
      setBannerAlt(`${user.name}'s banner`);
    }
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
          alt: avatarAlt || `${user.name}'s profile image`
        } : null,
        banner: bannerUrl ? {
          url: bannerUrl,
          alt: bannerAlt || `${user.name}'s banner`
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
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <FaUserEdit className="mr-2 text-[#0C5560]" />
          Edit Profile
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bio */}
          <div className="space-y-2">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C5560] focus:border-transparent transition"
              rows="4"
              placeholder="Tell us about yourself..."
              maxLength={159}
            />
            <div className="text-xs text-gray-500 text-right">
              {bio.length}/159 characters
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="text-lg font-medium text-gray-700 flex items-center">
              <FaImage className="mr-2 text-[#0C5560]" />
              Profile Images
            </h3>
            
            {/* Avatar URL */}
            <div className="space-y-2">
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">Avatar URL</label>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    id="avatar"
                    type="url"
                    value={avatarUrl}
                    onChange={handleAvatarUrlChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C5560] focus:border-transparent transition"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                {avatarUrl && (
                  <div className="flex-shrink-0">
                    <img src={avatarUrl} alt={avatarAlt} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                  </div>
                )}
              </div>
              <div className="mt-2">
                <label htmlFor="avatarAlt" className="block text-sm font-medium text-gray-700">Alt Text</label>
                <input
                  id="avatarAlt"
                  type="text"
                  value={avatarAlt}
                  onChange={(e) => setAvatarAlt(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C5560] focus:border-transparent transition"
                  placeholder="Describe your avatar image"
                />

              </div>
            </div>
            
            {/* Banner URL */}
            <div className="space-y-2">
              <label htmlFor="banner" className="block text-sm font-medium text-gray-700">Banner URL</label>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    id="banner"
                    type="url"
                    value={bannerUrl}
                    onChange={handleBannerUrlChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C5560] focus:border-transparent transition"
                    placeholder="https://example.com/banner.jpg"
                  />
                </div>
                {bannerUrl && (
                  <div className="flex-shrink-0">
                    <img src={bannerUrl} alt={bannerAlt} className="w-24 h-12 rounded object-cover border border-gray-200" />
                  </div>
                )}
              </div>
              <div className="mt-2">
                <label htmlFor="bannerAlt" className="block text-sm font-medium text-gray-700">Alt Text</label>
                <input
                  id="bannerAlt"
                  type="text"
                  value={bannerAlt}
                  onChange={(e) => setBannerAlt(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C5560] focus:border-transparent transition"
                  placeholder="Describe your banner image"
                />

              </div>
            </div>
          </div>

          {/* Venue Manager Toggle */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaUserCog className="text-[#0C5560] mr-2" />
                <span className="font-medium">Venue Manager</span>
              </div>
              <button
                type="button"
                className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${venueManager ? 'bg-[#0C5560]' : 'bg-gray-300'}`}
                onClick={handleToggle}
                aria-pressed={venueManager}
              >
                <span
                  className={`h-5 w-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${venueManager ? 'translate-x-7' : 'translate-x-0'}`}
                />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {venueManager 
                ? "You can create and manage venues. Turn off to switch to guest mode." 
                : "Turn on to become a venue manager and create your own venues."}
            </p>
          </div>

          {/* Success and Error Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              className="w-[150px ] px-4 py-3 bg-[#0C5560] text-white rounded-lg hover:bg-[#094147] transition duration-200 disabled:opacity-50 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 