import { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import VenueLightbox from './VenueLightbox';

export default function VenueCarousel({ media = [], alt = '' }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const intervalRef = useRef();
  const images = media.length ? media : [{ url: '', alt: 'No image' }];

  useEffect(() => {
    if (paused || images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [paused, images.length]);

  const goTo = (i) => setIndex((i + images.length) % images.length);

  return (
    <>
      <div
        className="relative w-full h-48 md:h-150 rounded-lg overflow-hidden group"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        tabIndex={0}
        aria-label="Venue image carousel"
      >
        {images.map((img, i) => (
          <img
            key={img.url || i}
            src={img.url}
            alt={alt || `Venue image ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            draggable={false}
            onClick={() => setLightboxOpen(true)}
            style={{ cursor: 'pointer' }}
          />
        ))}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#0C5560] rounded-full p-2 shadow transition z-20"
              onClick={() => goTo(index - 1)}
              aria-label="Previous image"
              tabIndex={0}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <FaChevronLeft size={20} />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#0C5560] rounded-full p-2 shadow transition z-20"
              onClick={() => goTo(index + 1)}
              aria-label="Next image"
              tabIndex={0}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <FaChevronRight size={20} />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`block w-2 h-2 rounded-full ${i === index ? 'bg-[#0C5560]' : 'bg-white border border-[#0C5560]'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {lightboxOpen && (
        <VenueLightbox
          media={images}
          index={index}
          onClose={() => setLightboxOpen(false)}
          onNavigate={i => setIndex((i + images.length) % images.length)}
          setPaused={setPaused}
        />
      )}
    </>
  );
} 