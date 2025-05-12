import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../Login';
import Register from '../Register';

export default function AuthModal({ open, onClose, onSuccess }) {
  const [mode, setMode] = useState('login');
  const navigate = useNavigate();

  if (!open) return null;

  const handleClose = () => {
    onClose();
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleClose}>
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
          onClick={handleClose}
          aria-label="Close"
        >
          &times;
        </button>
        {mode === 'login' ? (
          <Login
            onSuccess={onSuccess}
            onSwitch={() => setMode('register')}
          />
        ) : (
          <Register
            onSuccess={onSuccess}
            onSwitch={() => setMode('login')}
          />
        )}
      </div>
    </div>
  );
} 