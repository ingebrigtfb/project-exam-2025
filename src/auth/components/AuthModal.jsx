import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Login from '../Login';
import Register from '../Register';

export default function AuthModal({ open, onClose, onSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const navigate = useNavigate();
  const location = useLocation();

  // Update mode when initialMode changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  if (!open) return null;

  const handleClose = () => {
    onClose();
  };
  
  const handleAuthSuccess = (userData) => {
  
    if (onSuccess) {
      onSuccess(userData);
    }
    
  
    const isOnVenueDetailsPage = location.pathname.startsWith('/venues/');
    if (!isOnVenueDetailsPage) {
      navigate('/profile', { replace: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleClose}>
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-3xl"
          onClick={handleClose}
          aria-label="Close"
        >
          &times;
        </button>
        {mode === 'login' ? (
          <Login
            onSuccess={handleAuthSuccess}
            onSwitch={() => setMode('register')}
          />
        ) : (
          <Register
            onSuccess={handleAuthSuccess}
            onSwitch={() => setMode('login')}
          />
        )}
      </div>
    </div>
  );
} 