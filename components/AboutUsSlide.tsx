'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

export type ImageItem = {
  id: string;
  src: string;
  alt?: string;
};

interface Props {
  title?: string;
  subtitle?: string;
  images: ImageItem[];
  stats?: { label: string; value: string }[];
  theme?: 'light' | 'dark';
  rowHeight?: number;
  gap?: number;
  baseSpeed?: number;
  maxSpeed?: number;
  accentColor?: string;
}

const AboutUsSlide: React.FC<Props> = ({
  title = "Qui sommes-nous",
  subtitle = "Nous concevons des expériences IA concrètes, élégantes et performantes.",
  images,
  stats = [],
  theme = 'dark',
  rowHeight = 220,
  gap = 16,
  baseSpeed = 0.05,
  maxSpeed = 3,
  accentColor = '#5B8CFF'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const offsetRef = useRef(0);
  const lastMouseXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef(0);
  const velocityRef = useRef(0);
  const lastTimeRef = useRef(0);
  
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Dupliquer les images pour la boucle infinie
  const repeatImages = useCallback((images: ImageItem[], times: number = 3): ImageItem[] => {
    const repeated: ImageItem[] = [];
    for (let i = 0; i < times; i++) {
      images.forEach(img => {
        repeated.push({ ...img, id: `${img.id}-${i}` });
      });
    }
    return repeated;
  }, []);

  const repeatedImages = repeatImages(images, 3);
  const segmentWidth = (rowHeight + gap) * images.length;

  // Gestion de la visibilité
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible');
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animation principale
  const animate = useCallback(() => {
    if (!isVisible) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const now = performance.now();
    const deltaTime = now - lastTimeRef.current;
    lastTimeRef.current = now;

    // Calculer la vitesse basée sur la position de la souris (desktop) ou l'inertie (mobile)
    let speed = baseSpeed;
    
    if (!isMobile && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const mouseX = lastMouseXRef.current;
      const distanceFromCenter = Math.abs(mouseX - centerX);
      const maxDistance = rect.width / 2;
      const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
      
      speed = baseSpeed + (normalizedDistance * (maxSpeed - baseSpeed));
      
      // Direction basée sur la position de la souris
      if (mouseX < centerX) {
        speed = -speed;
      }
    } else if (isMobile && isDraggingRef.current) {
      // Inertie sur mobile
      speed = velocityRef.current * 0.02;
      velocityRef.current *= 0.95; // Friction
      
      if (Math.abs(velocityRef.current) < 0.1) {
        velocityRef.current = 0;
      }
    }

    // Mettre à jour l'offset
    offsetRef.current += speed;
    
    // Gestion de la boucle infinie
    if (offsetRef.current >= segmentWidth) {
      offsetRef.current -= segmentWidth;
    } else if (offsetRef.current <= -segmentWidth) {
      offsetRef.current += segmentWidth;
    }

    // Appliquer la transformation
    if (containerRef.current) {
      containerRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isVisible, isMobile, baseSpeed, maxSpeed, segmentWidth]);

  // Démarrer l'animation
  useEffect(() => {
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  // Gestion de la souris (desktop)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isMobile) return;
    lastMouseXRef.current = e.clientX;
  }, [isMobile]);

  // Gestion du drag (mobile)
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!isMobile) return;
    isDraggingRef.current = true;
    dragStartRef.current = e.clientX;
    velocityRef.current = 0;
  }, [isMobile]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isMobile || !isDraggingRef.current) return;
    
    const deltaX = e.clientX - dragStartRef.current;
    const now = performance.now();
    const deltaTime = now - lastTimeRef.current;
    
    if (deltaTime > 0) {
      velocityRef.current = deltaX / deltaTime;
    }
    
    lastTimeRef.current = now;
  }, [isMobile]);

  const handlePointerUp = useCallback(() => {
    if (!isMobile) return;
    isDraggingRef.current = false;
  }, [isMobile]);

  // Styles dynamiques
  const containerStyles = {
    '--accent-color': accentColor,
    '--row-height': `${rowHeight}px`,
    '--gap': `${gap}px`,
  } as React.CSSProperties;

  const isLight = theme === 'light';
  const bgColor = isLight ? '#F5F6F8' : 'url("/assets/data analyst.jpg")';
  const textColor = isLight ? '#0B0B0C' : '#E8ECF1';
  const cardBg = isLight ? '#FFFFFF' : '#1A1A1A';

  return (
    <section 
      className="w-full py-24 relative overflow-hidden"
      style={{ 
        color: '#E8ECF1', 
        ...containerStyles 
      }}
    >
      {/* Image de fond depuis la galerie - TOUJOURS AFFICHÉE */}
      <img 
        src="/assets/B2.png"
        alt="Background from gallery"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      />
      
      {/* Overlay sombre pour améliorer la lisibilité - TOUJOURS AFFICHÉ */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(10, 21, 32, 0.4) 0%, rgba(26, 31, 46, 0.3) 25%, rgba(45, 27, 105, 0.5) 50%, rgba(26, 31, 46, 0.3) 75%, rgba(10, 21, 32, 0.4) 100%)',
          zIndex: 1
        }}
      />
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
        {/* Header */}
        <div className="mb-16 max-w-4xl">
          <h2 
            className="text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
            style={{
              textShadow: !isLight ? '0 4px 20px rgba(107, 79, 163, 0.3)' : 'none'
            }}
          >
            {title}
          </h2>
          <p 
            className="text-xl lg:text-2xl text-opacity-80 max-w-[60ch] leading-relaxed"
            style={{
              textShadow: !isLight ? '0 2px 10px rgba(0, 0, 0, 0.3)' : 'none'
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Ruban d'images */}
        <div className="relative overflow-hidden mb-12">
          {/* Masque de fade */}
          <div 
            className="absolute inset-y-0 left-0 w-32 z-10 pointer-events-none"
            style={{
              background: isLight 
                ? `linear-gradient(to right, ${bgColor}, transparent)`
                : `linear-gradient(to right, rgba(10, 21, 32, 0.8), transparent)`
            }}
          />
          <div 
            className="absolute inset-y-0 right-0 w-32 z-10 pointer-events-none"
            style={{
              background: isLight 
                ? `linear-gradient(to left, ${bgColor}, transparent)`
                : `linear-gradient(to left, rgba(10, 21, 32, 0.8), transparent)`
            }}
          />

          {/* Container du ruban */}
          <div
            ref={containerRef}
            className="flex items-center"
            style={{ gap: `${gap}px` }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {repeatedImages.map((image) => (
              <div
                key={image.id}
                className="flex-shrink-0 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                style={{
                  width: `${rowHeight}px`,
                  height: `${rowHeight}px`,
                  backgroundColor: cardBg,
                }}
              >
                <Image
                  src={image.src}
                  alt={image.alt || ''}
                  width={rowHeight}
                  height={rowHeight}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Statistiques */}
        {stats.length > 0 && (
          <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div 
                  className="text-3xl lg:text-4xl font-bold mb-2"
                  style={{ color: accentColor }}
                >
                  {stat.value}
                </div>
                <div className="text-sm lg:text-base opacity-70 uppercase tracking-wider">
                  {stat.label}
                </div>
                {/* Pastille décorative */}
                <div 
                  className="w-2 h-2 rounded-full mx-auto mt-3"
                  style={{ backgroundColor: accentColor }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event listeners pour la souris */}
      {!isMobile && (
        <div
          className="fixed inset-0 pointer-events-none z-0"
          onMouseMove={(e) => handleMouseMove(e.nativeEvent)}
        />
      )}
    </section>
  );
};

export default AboutUsSlide;
