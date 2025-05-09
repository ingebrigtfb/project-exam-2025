import { useState, useEffect } from 'react';
import AuthModal from './components/AuthModal';

export default function RequireAuth({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });
  const [modalOpen, setModalOpen] = useState(!user);

  useEffect(() => {
    if (!user) setModalOpen(true);
    else setModalOpen(false);
  }, [user]);

  const handleSuccess = (userData) => {
    setUser(userData);
    setModalOpen(false);
  };

  if (!user) {
    return <AuthModal open={modalOpen} onClose={() => {}} onSuccess={handleSuccess} />;
  }

  return children;
} 