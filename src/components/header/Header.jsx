import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoWhite from '../../assets/Logo-white.svg';
import LogoTeal from '../../assets/Logo-teal.svg';
import { FaUserCircle } from 'react-icons/fa';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Clean up in case the component unmounts while menu is open
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/venues', label: 'Venues' },
    { path: '/bookings', label: 'Bookings' },
  ];

  // Color logic
  const useWhite = isHome && !isScrolled && !menuOpen;
  const navColor = useWhite
    ? 'text-white hover:text-white/80'
    : 'text-[#0C5560] hover:text-[#0C5560]/80';

  return (
    <header
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        isScrolled || menuOpen ? 'bg-white shadow-md' : 'bg-transparent'
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
            <Link
              to="/profile"
              className={`p-2 rounded-full transition-colors duration-300 ${navColor}`}
            >
              <FaUserCircle className="h-6 w-6" />
            </Link>
          </div>

          {/* Hamburger Button */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 z-[110] relative"
            aria-label="Open menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="sr-only">Open menu</span>
            <div className="relative w-7 h-7">
              {/* Top line */}
              <span
                className={`absolute left-0 top-1/2 w-7 h-0.5 rounded transition-all duration-300
                  ${menuOpen
                    ? 'rotate-45 bg-[#0C5560] translate-y-0'
                    : useWhite
                      ? 'bg-white -translate-y-2.5'
                      : 'bg-[#0C5560] -translate-y-2.5'
                  }`}
                style={{ transitionDelay: menuOpen ? '0.1s' : '0s' }}
              />
              {/* Middle line */}
              <span
                className={`absolute left-0 top-1/2 w-7 h-0.5 rounded transition-all duration-300
                  ${menuOpen
                    ? 'opacity-0 bg-[#0C5560]'
                    : useWhite
                      ? 'bg-white'
                      : 'bg-[#0C5560]'
                  }`}
                style={{ transitionDelay: menuOpen ? '0.2s' : '0.1s', transform: 'translateY(-50%)' }}
              />
              {/* Bottom line */}
              <span
                className={`absolute left-0 top-1/2 w-7 h-0.5 rounded transition-all duration-300
                  ${menuOpen
                    ? '-rotate-45 bg-[#0C5560] translate-y-0'
                    : useWhite
                      ? 'bg-white translate-y-2.5'
                      : 'bg-[#0C5560] translate-y-2.5'
                  }`}
                style={{ transitionDelay: menuOpen ? '0.3s' : '0.2s' }}
              />
            </div>
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[105] flex flex-col items-center justify-center gap-8 transition-all duration-500 ${
          menuOpen
            ? 'pointer-events-auto opacity-100 translate-y-0'
            : 'pointer-events-none opacity-0 -translate-y-10'
        } bg-white/95 md:hidden`}
      >
        {navLinks.map((link, idx) => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-2xl font-medium text-[#0C5560] transition-all duration-300`}
            style={{
              transitionDelay: menuOpen ? `${0.2 + idx * 0.07}s` : '0s',
              transform: menuOpen ? 'scale(1)' : 'scale(0.95)',
              opacity: menuOpen ? 1 : 0.5,
            }}
          >
            {link.label}
          </Link>
        ))}
        <Link
          to="/profile"
          className="p-3 rounded-full text-[#0C5560] transition-all duration-300"
          style={{
            transitionDelay: menuOpen ? `${0.2 + navLinks.length * 0.07}s` : '0s',
            transform: menuOpen ? 'scale(1)' : 'scale(0.95)',
            opacity: menuOpen ? 1 : 0.5,
          }}
        >
          <FaUserCircle className="h-8 w-8" />
        </Link>
      </div>
    </header>
  );
};

export default Header; 