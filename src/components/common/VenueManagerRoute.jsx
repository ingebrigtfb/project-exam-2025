import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function VenueManagerRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));
  
  useEffect(() => {
    if (!user || !user.venueManager) {
      alert('This page is only accessible to venue managers. Please upgrade your account in the profile settings.');
    }
  }, [user]);

  if (!user || !user.venueManager) {
    return <Navigate to="/profile?tab=settings" replace />;
  }

  return children;
} 