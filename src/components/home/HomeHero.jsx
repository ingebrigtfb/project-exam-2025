import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/background+overlay.png';
import VenueCard from '../VenueCard';
import AuthModal from '../../auth/components/AuthModal';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const fetchTopVenues = async () => {
  try {
    const response = await fetch(
      'https://v2.api.noroff.dev/holidaze/venues?sort=rating&sortOrder=desc&limit=3'
    );
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    return [];
  }
};

const HomeHero = () => {
  const navigate = useNavigate();
  const [topVenues, setTopVenues] = useState([]);
  const cardRefs = useRef([]);
  const [authOpen, setAuthOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const favoritesKey = user ? `favorites_${user.name}` : null;
  const [favorites, setFavorites] = useState(() => {
    if (!favoritesKey) return [];
    try {
      return JSON.parse(localStorage.getItem(favoritesKey)) || [];
    } catch {
      return [];
    }
  });

  const saveFavorites = (fav) => {
    if (!favoritesKey) return;
    setFavorites(fav);
    localStorage.setItem(favoritesKey, JSON.stringify(fav));
  };

  const handleToggleFavorite = (venueId) => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    const isFav = favorites.includes(venueId);
    const newFavs = isFav ? favorites.filter(id => id !== venueId) : [...favorites, venueId];
    saveFavorites(newFavs);
  };

  useEffect(() => {
    fetchTopVenues().then(setTopVenues);
  }, []);

  useEffect(() => {
    ScrollTrigger.refresh();
    cardRefs.current.forEach((card) => {
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            scrollTrigger: {
              trigger: card,
              start: 'top 100%',
              toggleActions: 'play none none reverse',
              markers: false,
            },
            ease: 'power2.out',
          }
        );
      }
    });

    return () => ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }, [topVenues]);

  cardRefs.current = [];

  useEffect(() => {
    if (favoritesKey) {
      try {
        setFavorites(JSON.parse(localStorage.getItem(favoritesKey)) || []);
      } catch {
        setFavorites([]);
      }
    }
  }, [favoritesKey]);

  return (
    <section className="relative h-[621px] flex items-center justify-center">
      <img 
        src={backgroundImage} 
        alt="Hero background" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 text-center text-white">
        <h1
          style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}
          className="text-5xl font-rubik font-medium mb-4"
        >
          Holidaze
        </h1>
        <p
          style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}
          className="text-5xl font-rubik font-medium mb-8"
        >
          Let us inspire you
        </p>
        <button
          className="btn-fancy"
          onClick={() => navigate('/venues')}
        >
          Explore
        </button>
      </div>

      {/* Desktop layout */} 
      <div className="hidden md:flex md:absolute md:bottom-0 md:z-20 md:w-full md:max-w-[1000px] md:mx-auto md:px-4 md:justify-center md:gap-6 md:translate-y-48">
        {topVenues.map((venue, idx) => (
          <div
            key={venue.id}
            ref={(el) => (cardRefs.current[idx] = el)}
            className="max-w-[298px] w-full flex justify-center transition-all duration-300"
          >
            <VenueCard
              venue={venue}
              isFavorite={favorites.includes(venue.id)}
              onToggleFavorite={handleToggleFavorite}
              onRequireAuth={() => setAuthOpen(true)}
            />
          </div>
        ))}
      </div>

      {/* Mobile layout */}
      <div className="md:hidden absolute bottom-0 z-20 w-full px-4 translate-y-200">
        <div className="flex flex-col items-center gap-6">
          {topVenues.map((venue, idx) => (
            <div
              key={venue.id}
              ref={(el) => (cardRefs.current[idx] = el)}
              className="w-full flex justify-center"
            >
              <VenueCard
                venue={venue}
                isFavorite={favorites.includes(venue.id)}
                onToggleFavorite={handleToggleFavorite}
                onRequireAuth={() => setAuthOpen(true)}
              />
            </div>
          ))}
        </div>
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </section>
  );
};

export default HomeHero;