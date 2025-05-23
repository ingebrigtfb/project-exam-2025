import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogoWhite from '../../assets/Logo-white.svg';
import LogoTeal from '../../assets/Logo-teal.svg';
import AuthModal from '../../auth/components/AuthModal';
import { useAuth } from '../../contexts/AuthContext';
import HeaderNavigation from './HeaderNavigation';

const Header = () => {
  const { user, logout, login } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isProfile = location.pathname === '/profile';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    navigate('/', { replace: true });
    window.location.reload();
  };

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleAuthSuccess = (userData) => {
    login(userData);
    setAuthModalOpen(false);
    // Redirection is now handled by the AuthModal component
  };

  // Color logic
  const useWhite = (isHome || isProfile) && !isScrolled && !isMobileMenuOpen;

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

          {/* Navigation Component */}
          <HeaderNavigation 
            user={user}
            isScrolled={isScrolled}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            useWhite={useWhite}
            handleAuthClick={handleAuthClick}
            handleLogout={handleLogout}
          />
        </nav>
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