import { useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

export default function VenueLightbox({ media = [], index = 0, onClose, onNavigate, setPaused }) {
  const imgRef = useRef();

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate(index - 1);
      if (e.key === 'ArrowRight') onNavigate(index + 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [index, onClose, onNavigate]);

  if (!media.length) return null;
  const img = media[(index + media.length) % media.length];

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80"
      onClick={onClose}
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
    >
      <button
        className="absolute top-4 right-4 text-white text-3xl z-20"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <FaTimes />
      </button>
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 z-20"
        onClick={e => { e.stopPropagation(); onNavigate(index - 1); }}
        aria-label="Previous image"
        onMouseEnter={() => setPaused && setPaused(true)}
        onMouseLeave={() => setPaused && setPaused(false)}
      >
        <FaChevronLeft size={28} />
      </button>
      <img
        ref={imgRef}
        src={img.url}
        alt={img.alt || `Venue image ${index + 1}`}
        className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg object-contain z-10"
        onClick={e => e.stopPropagation()}
      />
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 z-20"
        onClick={e => { e.stopPropagation(); onNavigate(index + 1); }}
        aria-label="Next image"
        onMouseEnter={() => setPaused && setPaused(true)}
        onMouseLeave={() => setPaused && setPaused(false)}
      >
        <FaChevronRight size={28} />
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {media.map((_, i) => (
          <span
            key={i}
            className={`block w-3 h-3 rounded-full ${i === ((index + media.length) % media.length) ? 'bg-white' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
} 