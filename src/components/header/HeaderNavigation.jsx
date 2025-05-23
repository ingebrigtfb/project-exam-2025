import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChevronDown, FaCalendarAlt, FaBuilding, FaHeart, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaHome } from 'react-icons/fa';
import { MdExplore } from 'react-icons/md';
import { CiSettings } from 'react-icons/ci';
import ProfileAvatar from '../profile/ProfileAvatar';

const HeaderNavigation = ({ 
  user, 
  isScrolled, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen, 
  useWhite, 
  handleAuthClick, 
  handleLogout 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const location = useLocation();
  const isLoggedIn = !!user;
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, setIsMobileMenuOpen]);

  // Dropdown toggle
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const profileLinks = [
    { path: '/profile?tab=bookings', label: 'My Bookings', icon: <FaCalendarAlt className="text-primary" /> },
    { path: '/profile?tab=venues', label: 'My Venues', icon: <FaBuilding className="text-primary" /> },
    { path: '/profile?tab=favorites', label: 'My Favorites', icon: <FaHeart className="text-primary" /> },
    { path: '/profile?tab=settings', label: 'Settings', icon: <CiSettings className="text-primary text-xl" /> }
  ];

  const authLinks = [
    { label: 'Login', mode: 'login', icon: <FaSignInAlt /> },
    { label: 'Register', mode: 'register', icon: <FaUserPlus /> },
  ];

  const navLinks = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/venues', label: 'Venues', icon: <MdExplore /> }
  ];

  // Color logic
  const navColor = useWhite
    ? 'text-white hover:text-white/80'
    : 'text-[#0C5560] hover:text-[#0C5560]/80';

  return (
    <>
      {/* Desktop Nav */}
      <div className="hidden md:flex items-center space-x-8">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`relative text-lg font-medium transition-colors duration-300 ${navColor}`}
          >
            {link.label}
            {location.pathname === link.path && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-current"></span>
            )}
          </Link>
        ))}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-2 cursor-pointer relative"
            onClick={toggleDropdown}
          >
            <ProfileAvatar user={user} size="sm" useWhite={useWhite} />
            <FaChevronDown
              className={`transition-transform duration-300 ${
                isDropdownOpen ? 'rotate-180' : ''
              } ${useWhite ? 'text-white' : 'text-[#0C5560]'}`}
            />
          </div>
          
          {/* Dropdown menu */}
          <div
            className={`absolute right-0 top-full mt-2 bg-white rounded-md shadow-lg overflow-hidden z-50 transition-all duration-300 ${
              isDropdownOpen
                ? 'opacity-100 visible'
                : 'opacity-0 invisible pointer-events-none'
            }`}
          >
            {isLoggedIn ? (
              <>
                <div className="flex flex-col w-56">
                  {profileLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.path}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-gray-100 text-red-600 transition-colors border-t border-gray-200"
                >
                  <FaSignOutAlt />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col w-56">
                {authLinks.map((link) => (
                  <button
                    key={link.mode}
                    onClick={() => handleAuthClick(link.mode)}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-lg text-[#0C5560]">{link.icon}</span>
                    <span>{link.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hamburger Button */}
      <button
        className="md:hidden flex items-center justify-center w-10 h-10 z-[110] relative"
        aria-label="Open menu"
        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
      >
        <span className="sr-only">Open menu</span>
        <div className="relative w-7 h-7">
          {/* Top line */}
          <span
            className={`absolute left-0 top-1/2 w-7 h-0.5 rounded transition-all duration-300
              ${isMobileMenuOpen
                ? 'rotate-45 bg-[#0C5560] translate-y-0'
                : useWhite
                  ? 'bg-white -translate-y-2.5'
                  : 'bg-[#0C5560] -translate-y-2.5'
              }`}
            style={{ transitionDelay: isMobileMenuOpen ? '0.1s' : '0s' }}
          />
          {/* Middle line */}
          <span
            className={`absolute left-0 top-1/2 w-7 h-0.5 rounded transition-all duration-300
              ${isMobileMenuOpen
                ? 'opacity-0 bg-[#0C5560]'
                : useWhite
                  ? 'bg-white'
                  : 'bg-[#0C5560]'
              }`}
            style={{ transitionDelay: isMobileMenuOpen ? '0.2s' : '0.1s', transform: 'translateY(-50%)' }}
          />
          {/* Bottom line */}
          <span
            className={`absolute left-0 top-1/2 w-7 h-0.5 rounded transition-all duration-300
              ${isMobileMenuOpen
                ? '-rotate-45 bg-[#0C5560] translate-y-0'
                : useWhite
                  ? 'bg-white translate-y-2.5'
                  : 'bg-[#0C5560] translate-y-2.5'
              }`}
            style={{ transitionDelay: isMobileMenuOpen ? '0.3s' : '0.2s' }}
          />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[105] flex flex-col transition-all duration-500 ${
          isMobileMenuOpen
            ? 'pointer-events-auto opacity-100 translate-y-0'
            : 'pointer-events-none opacity-0 -translate-y-10'
        } bg-white md:hidden`}
      >
        <div className="flex flex-col items-center pt-20 pb-10 h-full w-full px-6 gap-4">
          {/* Profile Avatar & Name at Top */}
          {isLoggedIn && (
            <div className="w-full max-w-xs flex flex-col items-center mb-6">
              <div className="mb-2">
                <ProfileAvatar user={user} size="lg" useWhite={false} />
              </div>
              <h2 className="text-xl font-medium text-[#0C5560]">
                {user?.name || 'My Account'}
              </h2>
              {user?.venueManager && (
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full mt-1">
                  Venue Manager
                </span>
              )}
            </div>
          )}
          
          {/* Navigation Links */}
          <div className="w-full max-w-xs">
            {navLinks.map((link, idx) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-4 text-xl font-medium text-[#0C5560] transition-all duration-300 py-3 ${
                  location.pathname === link.path ? 'bg-gray-50 rounded-lg' : ''
                }`}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${0.2 + idx * 0.07}s` : '0s',
                  transform: isMobileMenuOpen ? 'scale(1)' : 'scale(0.95)',
                  opacity: isMobileMenuOpen ? 1 : 0.5,
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-2xl text-[#0C5560] ml-2">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px w-full max-w-xs bg-gray-200 my-2"></div>

          {/* Profile Links */}
          <div className="w-full max-w-xs">
            {isLoggedIn ? (
              <>
                {profileLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.path}
                    className="flex items-center gap-4 text-xl font-medium text-[#0C5560] transition-all duration-300 py-3"
                    style={{
                      transitionDelay: isMobileMenuOpen ? `${0.3 + idx * 0.07}s` : '0s',
                      transform: isMobileMenuOpen ? 'scale(1)' : 'scale(0.95)',
                      opacity: isMobileMenuOpen ? 1 : 0.5,
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-2xl text-[#0C5560] ml-2">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                ))}
                <div className="h-px w-full bg-gray-200 my-2"></div>
                <button
                  className="flex items-center gap-4 text-xl font-medium text-red-600 transition-all duration-300 py-3 w-full text-left"
                  style={{
                    transitionDelay: isMobileMenuOpen ? `${0.3 + profileLinks.length * 0.07}s` : '0s',
                    transform: isMobileMenuOpen ? 'scale(1)' : 'scale(0.95)',
                    opacity: isMobileMenuOpen ? 1 : 0.5,
                  }}
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span className="text-2xl ml-2"><FaSignOutAlt /></span>
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                {authLinks.map((link, idx) => (
                  <button
                    key={link.mode}
                    onClick={() => {
                      handleAuthClick(link.mode);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-4 text-xl font-medium text-[#0C5560] transition-all duration-300 py-3 w-full text-left"
                    style={{
                      transitionDelay: isMobileMenuOpen ? `${0.3 + idx * 0.07}s` : '0s',
                      transform: isMobileMenuOpen ? 'scale(1)' : 'scale(0.95)',
                      opacity: isMobileMenuOpen ? 1 : 0.5,
                    }}
                  >
                    <span className="text-2xl text-[#0C5560] ml-2">{link.icon}</span>
                    <span>{link.label}</span>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderNavigation; 