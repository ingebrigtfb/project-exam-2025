import { useState } from 'react';
import Login from '../Login';
import Register from '../Register';

export default function AuthModal({ open, onClose, onSuccess }) {
  const [mode, setMode] = useState('login');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
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