import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../../auth/components/AuthModal';
import footerBackground from '../../assets/footer-background.png';

export default function Footer() {
  const { user, login } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  
  const isLoggedIn = !!user;
  
  const handleProfileClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setAuthMode('login');
      setAuthModalOpen(true);
    }
  };
  
  const handleAuthSuccess = (userData) => {
    login(userData);
    setAuthModalOpen(false);
    // Redirection is now handled by the AuthModal component
  };

  return (
    <footer className="relative mt-24">
      <div className="relative min-h-[600px] md:min-h-[500px]">
        <img 
          src={footerBackground} 
          alt="Footer background" 
          className="w-full h-full object-cover object-bottom absolute inset-0 z-0"
        />
        <div className="absolute bottom-0 left-0 w-full z-10 flex flex-col items-center pb-12 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white justify-items-start md:justify-items-center max-w-[1400px] w-full mx-auto">
            <div className="hidden md:block">
              <h3 className="text-xl font-semibold mb-4 text-white drop-shadow-lg">Holidaze</h3>
              <p className="text-white/90 drop-shadow-md">
                Your perfect holiday destination awaits. Find and book unique accommodations for your next adventure.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white drop-shadow-lg">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/venues" className="text-white/90 hover:text-white transition drop-shadow-md">
                    Browse Venues
                  </Link>
                </li>
                <li>
                  <Link 
                    to={isLoggedIn ? "/profile" : "#"} 
                    onClick={handleProfileClick}
                    className="text-white/90 hover:text-white transition drop-shadow-md"
                  >
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link 
                    to={isLoggedIn ? "/profile?tab=bookings" : "#"} 
                    onClick={handleProfileClick}
                    className="text-white/90 hover:text-white transition drop-shadow-md"
                  >
                    My Bookings
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white drop-shadow-lg">Contact</h3>
              <ul className="space-y-2 text-white/90 drop-shadow-md">
                <li>Email: contact@holidaze.com</li>
                <li>Phone: +47 123 45 678</li>
                <li>Address: Oslo, Norway</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/20 text-center text-white/90 drop-shadow-md w-full max-w-[1400px] mx-auto">
            <p>&copy; {new Date().getFullYear()} Holidaze. All rights reserved.</p>
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
    </footer>
  );
} 