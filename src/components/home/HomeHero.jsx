import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/background+overlay.png';
import VenueCard from '../VenueCard';
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

  // Reset refs before rendering new ones
  cardRefs.current = [];

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
      <div className="hidden md:flex md:absolute md:bottom-0 md:z-20 md:w-full md:max-w-[1000px] md:mx-auto md:px-4 md:justify-center md:gap-6 md:translate-y-55">
        {topVenues.map((venue, idx) => (
          <div
            key={venue.id}
            ref={(el) => (cardRefs.current[idx] = el)}
            className="max-w-[298px] w-full flex justify-center transition-all duration-300"
          >
            <VenueCard venue={venue} />
          </div>
        ))}
      </div>

      {/* Mobile layout */}
      <div className="md:hidden absolute bottom-0 z-20 w-full px-4 translate-y-220">
        <div className="flex flex-col items-center gap-6">
          {topVenues.map((venue, idx) => (
            <div
              key={venue.id}
              ref={(el) => (cardRefs.current[idx] = el)}
              className="w-full flex justify-center"
            >
              <VenueCard venue={venue} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeHero;