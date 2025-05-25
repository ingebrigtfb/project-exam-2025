import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import venueManagerImage from '../../assets/venuemanager.png';
import AuthModal from '../../auth/components/AuthModal';
import { useAuth } from '../../contexts/AuthContext';
import gsap from 'gsap';

const BecomeVenueManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const textSectionRef = useRef(null);
  const imageSectionRef = useRef(null);
  const mobileTextRef = useRef(null);
  const mobileImageRef = useRef(null);

  const handleRegisterClick = () => {
    if (user) {
      navigate('/profile?tab=settings');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = (userData) => {
    setShowAuthModal(false);
    navigate('/profile?tab=settings');
  };
  
  // Add GSAP animations
  useEffect(() => {
    // Set initial states for animation
    if (textSectionRef.current) {
      gsap.set(textSectionRef.current, { opacity: 0, x: -50 });
    }
    
    if (imageSectionRef.current) {
      gsap.set(imageSectionRef.current, { opacity: 0, x: 50 });
    }
    
    if (mobileImageRef.current) {
      gsap.set(mobileImageRef.current, { opacity: 0, y: -30 });
    }
    
    if (mobileTextRef.current) {
      gsap.set(mobileTextRef.current, { opacity: 0, y: 30 });
    }
    
    // Simple animation on component mount
    const tl = gsap.timeline({ delay: 0.3 });
    
    // Desktop animations
    tl.to(textSectionRef.current, { 
      opacity: 1, 
      x: 0, 
      duration: 0.8,
      ease: 'power2.out' 
    });
    
    tl.to(imageSectionRef.current, { 
      opacity: 1, 
      x: 0, 
      duration: 0.8,
      ease: 'power2.out' 
    }, "-=0.6");
    
    // Mobile animations
    tl.to(mobileImageRef.current, { 
      opacity: 1, 
      y: 0, 
      duration: 0.7,
      ease: 'power2.out' 
    }, "-=0.8");
    
    tl.to(mobileTextRef.current, { 
      opacity: 1, 
      y: 0, 
      duration: 0.7,
      ease: 'power2.out' 
    }, "-=0.5");
    
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-16 md:py-20">
      {/* Mobile layout - image on top */}
      <div className="flex flex-col md:hidden items-center gap-8">
        <div className="w-80" ref={mobileImageRef}>
          <img 
            src={venueManagerImage} 
            alt="Venue manager welcoming guests" 
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
        <div className="w-full space-y-6 flex-col items-center justify-center" ref={mobileTextRef}>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">
            Got a place to share?<br />
            Become a Venue Manager.
          </h2>
          <p className="text-lg text-gray-700">
            Earn money by listing your property on Holidaze. Create, manage, and track bookings easily — all in one place.
          </p>
          <button 
            onClick={handleRegisterClick}
            className="mt-4 inline-block border-2 border-[#0C5560] text-[#0C5560] font-medium px-8 py-3 rounded-md hover:bg-[#0C5560] hover:text-white transition-colors duration-300"
          >
            {user ? 'Go to Settings' : 'Register'}
          </button>
        </div>
      </div>

      {/* Desktop layout - side by side */}
      <div className="hidden md:flex md:flex-row items-center justify-between gap-8">
        <div className="w-1/2 space-y-6" ref={textSectionRef}>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            Got a place to share?<br />
            Become a Venue Manager.
          </h2>
          <p className="text-lg text-gray-700 max-w-md">
            Earn money by listing your property on Holidaze. Create, manage, and track bookings easily — all in one place.
          </p>
          <button 
            onClick={handleRegisterClick}
            className="mt-4 inline-block border-2 border-[#0C5560] text-[#0C5560] font-medium px-8 py-3 rounded-md hover:bg-[#0C5560] hover:text-white transition-colors duration-300"
          >
            {user ? 'Go to Settings' : 'Register'}
          </button>
        </div>
        <div className="w-1/2" ref={imageSectionRef}>
          <img 
            src={venueManagerImage} 
            alt="Venue manager welcoming guests" 
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        initialMode="register"
      />
    </div>
  );
};

export default BecomeVenueManager; 