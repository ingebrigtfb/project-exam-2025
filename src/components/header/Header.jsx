import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogoWhite from '../../assets/Logo-white.svg';
import LogoTeal from '../../assets/Logo-teal.svg';
import { FaUserCircle, FaChevronDown, FaChevronRight, FaCalendarAlt, FaBuilding, FaHeart, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { CiSettings } from 'react-icons/ci';
import AuthModal from '../../auth/components/AuthModal';
import { useAuth } from '../../contexts/AuthContext';
import ProfileAvatar from '../profile/ProfileAvatar';

const Header = () => {
  const { user, logout, login } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isProfile = location.pathname === '/profile';
  const isLoggedIn = !!user;
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Clean up in case the component unmounts while menu is open
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
    navigate('/', { replace: true });
    window.location.reload();
  };

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleAuthSuccess = (userData) => {
    login(userData);
    setAuthModalOpen(false);
    // Redirection is now handled by the AuthModal component
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
    { path: '/', label: 'Home' },
    { path: '/venues', label: 'Venues' }
  ];

  // Color logic
  const useWhite = (isHome || isProfile) && !isScrolled && !isMobileMenuOpen;
  const navColor = useWhite
    ? 'text-white hover:text-white/80'
    : 'text-[#0C5560] hover:text-[#0C5560]/80';

  // Dropdown toggle
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
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

  return (
    <header
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        isScrolled || isMobileMenuOpen ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src={useWhite ? LogoWhite : LogoTeal}
              alt="Holidaze Logo"
              className="h-14 transition-colors duration-300"
            />
          </Link>

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
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[105] flex flex-col items-center pt-50 transition-all duration-500 ${
          isMobileMenuOpen
            ? 'pointer-events-auto opacity-100 translate-y-0'
            : 'pointer-events-none opacity-0 -translate-y-10'
        } bg-white/95 md:hidden`}
      >
        <div className="flex flex-col items-center gap-8">
          {/* Navigation Links */}
          {navLinks.map((link, idx) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-2xl font-medium text-[#0C5560] transition-all duration-300`}
              style={{
                transitionDelay: isMobileMenuOpen ? `${0.2 + idx * 0.07}s` : '0s',
                transform: isMobileMenuOpen ? 'scale(1)' : 'scale(0.95)',
                opacity: isMobileMenuOpen ? 1 : 0.5,
              }}
            >
              {link.label}
            </Link>
          ))}

          {/* Profile Section - Mobile */}
          <div className="relative w-full">
            <div
              className="flex items-center justify-center gap-2 cursor-pointer px-4 py-2 rounded-lg transition-colors hover:bg-gray-50"
              onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
            >
              <ProfileAvatar user={user} size="md" useWhite={false} />
              <span className="text-[#0C5560] font-medium">
                {user ? user.name || 'My Account' : 'Account'}
              </span>
              <FaChevronDown
                className={`transition-transform duration-300 ml-1 ${
                  isMobileProfileOpen ? 'rotate-180' : ''
                } text-[#0C5560]`}
              />
            </div>
            
            {/* Mobile Submenu */}
            {isMobileProfileOpen && (
              <div className="absolute top-full left-0 w-full bg-white p-4 mt-3 shadow-lg rounded-xl border border-gray-100 z-30">
                {isLoggedIn ? (
                  <div className="flex flex-col gap-2">
                    {profileLinks.map((link, idx) => (
                      <Link
                        key={idx}
                        to={link.path}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-[#0C5560] transition-all duration-200 hover:bg-gray-50"
                        style={{
                          opacity: isMobileProfileOpen ? 1 : 0,
                          transform: isMobileProfileOpen ? 'translateY(0)' : 'translateY(-10px)',
                          transitionDelay: `${idx * 0.05}s`,
                        }}
                        onClick={() => {
                          setIsMobileProfileOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <span className="text-xl">{link.icon}</span>
                        <span>{link.label}</span>
                      </Link>
                    ))}
                    <div className="h-px w-full bg-gray-200 my-2"></div>
                    <button
                      className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 transition-all duration-200 hover:bg-red-50"
                      style={{
                        opacity: isMobileProfileOpen ? 1 : 0,
                        transform: isMobileProfileOpen ? 'translateY(0)' : 'translateY(-10px)',
                        transitionDelay: `${profileLinks.length * 0.05}s`,
                      }}
                      onClick={() => {
                        handleLogout();
                        setIsMobileProfileOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <span className="text-xl"><FaSignOutAlt /></span>
                      <span>Log Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {authLinks.map((link, idx) => (
                      <button
                        key={link.mode}
                        onClick={() => {
                          handleAuthClick(link.mode);
                          setIsMobileProfileOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg font-medium text-[#0C5560] transition-all duration-200 hover:bg-gray-50"
                        style={{
                          opacity: isMobileProfileOpen ? 1 : 0,
                          transform: isMobileProfileOpen ? 'translateY(0)' : 'translateY(-10px)',
                          transitionDelay: `${idx * 0.05}s`,
                        }}
                      >
                        <span className="text-xl">{link.icon}</span>
                        <span>{link.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authMode}
      />
    </header>
  );
};

export default Header; 