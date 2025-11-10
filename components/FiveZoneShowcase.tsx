'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';

export type Img = { 
  id: string; 
  src: string; 
  alt?: string; 
};

interface Props {
  images: Img[];             // Au moins 5 éléments visibles
  height?: number;           // hauteur px (default 800)
  gap?: number;              // espace entre cartes (default 20)
  activeScale?: number;      // 1.05 par défaut
  inactiveOpacity?: number;  // 0.45 par défaut
  className?: string;
}

const FiveZoneShowcase: React.FC<Props> = ({
  images,
  height = 800,
  gap = 20,
  activeScale = 1.05,
  inactiveOpacity = 0.45,
  className = ''
}) => {
  const [activeIndex, setActiveIndex] = useState(2); // Commencer au centre
  
  const containerRef = useRef<HTMLDivElement>(null);

  // S'assurer qu'on a exactement 5 images
  const displayImages = images.length >= 5 ? images.slice(0, 5) : [
    ...images,
    ...Array(5 - images.length).fill(null).map((_, i) => ({
      id: `placeholder-${i}`,
      src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center',
      alt: `Placeholder ${i + 1}`
    }))
  ];

  // Navigation avec boutons
  const goToPrevious = useCallback(() => {
    setActiveIndex(prev => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex(prev => Math.min(4, prev + 1));
  }, []);

  // Navigation clavier
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  }, [goToPrevious, goToNext]);

  // Ajouter les événements clavier
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div
      ref={containerRef}
      className={`relative w-screen overflow-hidden ${className}`}
      style={{ 
        height: `${height}px`,
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)'
      }}
      role="tablist"
      aria-label="Galerie d'images interactive"
    >
      {/* Masque latéral */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)'
        }}
      />
      
      {/* Bouton précédent */}
      <button
        onClick={goToPrevious}
        disabled={activeIndex === 0}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Image précédente"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Bouton suivant */}
      <button
        onClick={goToNext}
        disabled={activeIndex === 4}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Image suivante"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Container des images */}
      <div 
        className="flex items-center h-full w-full"
        style={{ 
          gap: `${gap}px`
        }}
      >
        {displayImages.map((image, index) => (
          <div
            key={image.id}
            className="relative flex-1 rounded-3xl overflow-hidden transition-all duration-300 ease-out border-2 border-white/20"
            style={{
              height: `${height}px`,
              minWidth: 0, // Permet au flex-1 de fonctionner correctement
              transform: `scale(${activeIndex === index ? activeScale : 1})`,
              opacity: activeIndex === index ? 1 : inactiveOpacity,
              zIndex: activeIndex === index ? 10 : 0,
              boxShadow: activeIndex === index 
                ? '0 25px 50px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.3)' 
                : '0 8px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              transformOrigin: 'center'
            }}
            role="tab"
            aria-selected={activeIndex === index}
            tabIndex={0}
          >
            <Image
              src={image.src}
              alt={image.alt || `Image ${index + 1}`}
              fill
              className="object-cover"
              loading="eager"
              decoding="async"
              sizes="(max-width: 768px) 20vw, (max-width: 1024px) 18vw, 20vw"
              priority={index < 3} // Priorité pour les 3 premières images
            />
          </div>
        ))}
      </div>
      
      {/* Indicateurs de zone (optionnel, pour debug) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 z-20 bg-black/50 text-white px-2 py-1 rounded text-sm">
          Zone active: {activeIndex + 1}/5
        </div>
      )}
    </div>
  );
};

export default FiveZoneShowcase;
