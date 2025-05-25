import { useEffect, useRef } from 'react';
import carIcon from '../../assets/car.png';
import hertzLogo from '../../assets/Hertz.png';
import avisLogo from '../../assets/avis.png';
import sixtLogo from '../../assets/sixt.png';
import gsap from 'gsap';

const CarRentalPartners = () => {
  // Create refs for the elements we want to animate
  const carIconRef = useRef(null);
  const desktopTextRef = useRef(null);
  const logosContainerRef = useRef(null);
  const mobileTextRef = useRef(null);
  const mobileLogosRef = useRef(null);
  
  // Add GSAP animations
  useEffect(() => {
    // Set initial states
    if (carIconRef.current) {
      gsap.set(carIconRef.current, { opacity: 0, x: -50, rotate: -10 });
    }
    
    if (desktopTextRef.current) {
      gsap.set(desktopTextRef.current, { opacity: 0, y: -30 });
    }
    
    // Get all logo links for desktop
    const logos = logosContainerRef.current ? 
      logosContainerRef.current.querySelectorAll('a') : [];
      
    // Set initial state for logos
    gsap.set(logos, { opacity: 0, y: 30 });
    
    // Set initial state for mobile elements
    if (mobileTextRef.current) {
      gsap.set(mobileTextRef.current, { opacity: 0, y: -20 });
    }
    
    // Get all mobile logos
    const mobileLogos = mobileLogosRef.current ? 
      mobileLogosRef.current.querySelectorAll('a') : [];
      
    // Set initial state for mobile logos
    gsap.set(mobileLogos, { opacity: 0, scale: 0.8 });
    
    // Create animation timeline
    const tl = gsap.timeline({ delay: 0.5 });
    
    // Animate car icon
    tl.to(carIconRef.current, {
      opacity: 1,
      x: 0,
      rotate: 0,
      duration: 1,
      ease: 'power2.out',
    });
    
    // Animate desktop text
    tl.to(desktopTextRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    }, "-=0.7");
    
    // Animate desktop logos with stagger
    tl.to(logos, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: 'power2.out',
    }, "-=0.5");
    
    // Animate mobile text
    tl.to(mobileTextRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
    }, "-=1.2");
    
    // Animate mobile logos with stagger
    tl.to(mobileLogos, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      stagger: 0.15,
      ease: 'back.out(1.2)',
    }, "-=0.5");
    
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-16">
      <div className="flex flex-col items-center">
        {/* Desktop layout */}
        <div className="hidden md:flex w-full">
          <div className="flex flex-row items-start w-full">
            {/* Car icon column */}
            <div className="w-1/4 flex justify-center" ref={carIconRef}>
              <img 
                src={carIcon} 
                alt="Car icon" 
                className="w-70"
              />
            </div>
            
            {/* Text and logos column */}
            <div className="w-3/4 flex flex-col items-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-12" ref={desktopTextRef}>
                Start your journey with the perfect ride
              </h2>
              
              {/* Car rental company logos */}
              <div className="flex justify-center items-center gap-12 pr-12" ref={logosContainerRef}>
                <a 
                  href="https://www.hertz.no/rentacar/reservation/?gad_source=1&gad_campaignid=125499550&gbraid=0AAAAADqnBBrHB9N9albHLMaowam6tNGLL&gclid=Cj0KCQjwucDBBhDxARIsANqFdr0n4Vh6hiciVJbO0zT6hmrbALbDH1WsktXtd1BkvbZxxVb9bcmr9BAaAqMaEALw_wcB" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="transition-transform hover:scale-105"
                >
                  <img 
                    src={hertzLogo} 
                    alt="Hertz" 
                    className="h-15 object-contain"
                  />
                </a>
                <a 
                  href="https://www.avis.no/?cid=pp_site-GOOGLE_camp-1783417424_adgroup-70901550122_target-kwd-13402896_creative-561031080143_device-c_feed-&gad_source=1&gad_campaignid=1783417424&gbraid=0AAAAADEVRUINZcijF9SeIdt0BWlyuZq6x&gclid=Cj0KCQjwucDBBhDxARIsANqFdr3LUYA8b7n2lzA5332psR1EhnxLhU7h3JURtMYm7O4gx6dpHirv2-gaAs5oEALw_wcB&gclsrc=aw.ds" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="transition-transform hover:scale-105"
                >
                  <img 
                    src={avisLogo} 
                    alt="Avis" 
                    className="h-15 object-contain"
                  />
                </a>
                <a 
                  href="https://www.sixt.no/?gad_source=1&gad_campaignid=77984855&gbraid=0AAAAAD98fIXKQc25Aga5jo9OK3J4qHxS4&gclid=Cj0KCQjwucDBBhDxARIsANqFdr3RnaF2yZTThvGwDxYoRcTaafbG8xh7jECdKN2_Hw7uk5H3vWiQv_saAkAgEALw_wcB#/?sxamc=Google|Search&fir=1" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="transition-transform hover:scale-105"
                >
                  <img 
                    src={sixtLogo} 
                    alt="Sixt" 
                    className="h-15 object-contain"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile layout */}
        <div className="flex flex-col items-center md:hidden w-full">
          <h2 className="text-2xl font-bold text-center mb-10" ref={mobileTextRef}>
            Start your journey with the perfect ride
          </h2>
          
          {/* Car rental company logos */}
          <div className="flex flex-wrap justify-center items-center gap-8 w-full" ref={mobileLogosRef}>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="transition-transform hover:scale-105"
            >
              <img 
                src={hertzLogo} 
                alt="Hertz" 
                className="h-10 object-contain"
              />
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="transition-transform hover:scale-105"
            >
              <img 
                src={avisLogo} 
                alt="Avis" 
                className="h-10 object-contain"
              />
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="transition-transform hover:scale-105"
            >
              <img 
                src={sixtLogo} 
                alt="Sixt" 
                className="h-10 object-contain"
              />
            </a>
          </div>
        </div>
        
        {/* Horizontal divider line at bottom */}
        <div className="w-full h-px bg-gray-300 mt-12"></div>
      </div>
    </div>
  );
};

export default CarRentalPartners; 