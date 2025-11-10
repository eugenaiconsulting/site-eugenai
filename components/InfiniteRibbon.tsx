'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import Image from 'next/image';

export type Img = { 
  id: string; 
  src: string; 
  alt?: string; 
};

interface Props {
  images: Img[];
  rowHeight?: number;   // 220 par défaut
  gap?: number;         // 16 par défaut
  baseSpeed?: number;   // 0.05
  maxSpeed?: number;    // 3
  enableZones?: boolean; // true pour activer la division en 5 et le magnétisme
  className?: string;
}

interface Zone {
  left: number;
  right: number;
  activeCardIndex: number;
}

interface CardState {
  x: number;
  targetX: number;
  isActive: boolean;
  speed: number;
}

const InfiniteRibbon: React.FC<Props> = ({
  images,
  rowHeight = 220,
  gap = 16,
  baseSpeed = 0.05,
  maxSpeed = 3,
  enableZones = true,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const offsetRef = useRef(0);
  const mouseXRef = useRef(0);
  const isMouseOverRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const lastTouchXRef = useRef(0);
  const velocityRef = useRef(0);
  const lastTimeRef = useRef(0);
  
  const [zones, setZones] = useState<Zone[]>([]);
  const [cardStates, setCardStates] = useState<CardState[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calcul des zones
  const calculateZones = useCallback(() => {
    if (!containerRef.current || !enableZones || isMobile) return;
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const zoneWidth = containerWidth / 5;
    
    const newZones: Zone[] = [];
    for (let i = 0; i < 5; i++) {
      newZones.push({
        left: containerRect.left + (i * zoneWidth),
        right: containerRect.left + ((i + 1) * zoneWidth),
        activeCardIndex: -1
      });
    }
    
    setZones(newZones);
  }, [enableZones, isMobile]);

  // Initialisation des états des cartes
  const initializeCardStates = useCallback(() => {
    const states: CardState[] = images.map((_, index) => ({
      x: index * (rowHeight + gap),
      targetX: index * (rowHeight + gap),
      isActive: false,
      speed: baseSpeed
    }));
    setCardStates(states);
  }, [images.length, rowHeight, gap, baseSpeed]);

  // Calcul de la vitesse basée sur la position de la souris
  const calculateSpeed = useCallback((mouseX: number, containerLeft: number, containerWidth: number) => {
    const centerX = containerLeft + containerWidth / 2;
    const posNorm = (mouseX - centerX) / (containerWidth / 2);
    const clampedPosNorm = Math.max(-1, Math.min(1, posNorm));
    return baseSpeed + Math.abs(clampedPosNorm) * (maxSpeed - baseSpeed);
  }, [baseSpeed, maxSpeed]);

  // Trouve la carte active dans une zone
  const findActiveCardInZone = useCallback((zone: Zone, containerLeft: number) => {
    if (!containerRef.current) return -1;
    
    const containerWidth = containerRef.current.getBoundingClientRect().width;
    const segmentWidth = (rowHeight + gap) * images.length;
    const currentOffset = offsetRef.current % segmentWidth;
    
    // Trouve la carte dont le bord droit est le plus proche du bord gauche de la zone
    let closestCardIndex = -1;
    let minDistance = Infinity;
    
    for (let i = 0; i < images.length; i++) {
      const cardX = (i * (rowHeight + gap) - currentOffset) % segmentWidth;
      if (cardX < 0) cardX += segmentWidth;
      
      const cardRight = cardX + rowHeight;
      const distance = Math.abs(cardRight - (zone.left - containerLeft));
      
      if (distance < minDistance) {
        minDistance = distance;
        closestCardIndex = i;
      }
    }
    
    return closestCardIndex;
  }, [images.length, rowHeight, gap]);

  // Animation principale
  const animate = useCallback((timestamp: number) => {
    if (!containerRef.current || document.visibilityState !== 'visible') {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const segmentWidth = (rowHeight + gap) * images.length;

    // Calcul de la vitesse
    let currentSpeed = baseSpeed;
    if (isMouseOverRef.current && !isMobile) {
      currentSpeed = calculateSpeed(mouseXRef.current, containerRect.left, containerWidth);
    } else if (isDraggingRef.current && isMobile) {
      currentSpeed = velocityRef.current;
    }

    // Mise à jour de l'offset
    offsetRef.current += currentSpeed;
    
    // Recycling
    if (offsetRef.current >= segmentWidth) {
      offsetRef.current -= segmentWidth;
    } else if (offsetRef.current < 0) {
      offsetRef.current += segmentWidth;
    }

    // Mise à jour des zones et cartes actives
    if (enableZones && !isMobile && zones.length > 0) {
      const newCardStates = [...cardStates];
      
      zones.forEach((zone, zoneIndex) => {
        const activeCardIndex = findActiveCardInZone(zone, containerRect.left);
        
        if (activeCardIndex !== -1) {
          // Mise à jour de la carte active
          const cardState = newCardStates[activeCardIndex];
          if (cardState) {
            cardState.isActive = true;
            cardState.targetX = Math.max(
              zone.left - containerRect.left + 20,
              Math.min(
                zone.right - containerRect.left - rowHeight - 20,
                mouseXRef.current - containerRect.left - rowHeight / 2
              )
            );
            
            // Lerp vers la position cible
            const k = 0.18;
            cardState.x += (cardState.targetX - cardState.x) * k;
          }
          
          // Désactivation des autres cartes de la zone
          newCardStates.forEach((state, index) => {
            if (index !== activeCardIndex) {
              state.isActive = false;
              state.speed = currentSpeed * 0.6; // Parallax léger
            }
          });
        }
      });
      
      setCardStates(newCardStates);
    }

    // Application des transformations
    const cards = container.querySelectorAll('.ribbon-card');
    cards.forEach((card, index) => {
      const cardState = cardStates[index];
      if (cardState) {
        const baseX = (index * (rowHeight + gap) - offsetRef.current) % segmentWidth;
        const finalX = cardState.isActive ? cardState.x : baseX;
        
        (card as HTMLElement).style.transform = `translate3d(${finalX}px, 0, 0)`;
      }
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [baseSpeed, calculateSpeed, enableZones, isMobile, zones, cardStates, findActiveCardInZone, rowHeight, gap, images.length]);

  // Gestionnaires d'événements souris
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isMobile) return;
    mouseXRef.current = e.clientX;
    isMouseOverRef.current = true;
  }, [isMobile]);

  const handleMouseEnter = useCallback(() => {
    if (isMobile) return;
    isMouseOverRef.current = true;
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (isMobile) return;
    isMouseOverRef.current = false;
    isDraggingRef.current = false;
  }, [isMobile]);

  // Gestionnaires tactiles
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!isMobile) return;
    isDraggingRef.current = true;
    lastTouchXRef.current = e.touches[0].clientX;
    dragOffsetRef.current = offsetRef.current;
    velocityRef.current = 0;
    lastTimeRef.current = performance.now();
  }, [isMobile]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isMobile || !isDraggingRef.current) return;
    e.preventDefault();
    
    const currentTouchX = e.touches[0].clientX;
    const currentTime = performance.now();
    const deltaX = lastTouchXRef.current - currentTouchX;
    const deltaTime = currentTime - lastTimeRef.current;
    
    if (deltaTime > 0) {
      velocityRef.current = deltaX / deltaTime * 1000; // px/s
    }
    
    offsetRef.current = dragOffsetRef.current + deltaX;
    lastTouchXRef.current = currentTouchX;
    lastTimeRef.current = currentTime;
  }, [isMobile]);

  const handleTouchEnd = useCallback(() => {
    if (!isMobile) return;
    isDraggingRef.current = false;
    // L'inertie est gérée par velocityRef.current dans animate()
  }, [isMobile]);

  // Initialisation et nettoyage
  useEffect(() => {
    initializeCardStates();
    calculateZones();
    
    const container = containerRef.current;
    if (!container) return;

    // Événements souris
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    // Événements tactiles
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    
    // Démarrer l'animation
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [initializeCardStates, calculateZones, handleMouseMove, handleMouseEnter, handleMouseLeave, handleTouchStart, handleTouchMove, handleTouchEnd, animate]);

  // Recalcul des zones au redimensionnement
  useEffect(() => {
    const handleResize = () => {
      calculateZones();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateZones]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ height: rowHeight }}
    >
      <div className="fade-mask absolute inset-0 pointer-events-none z-10" />
      <div className="flex items-center h-full">
        {images.map((image, index) => (
          <div
            key={`${image.id}-${index}`}
            className="ribbon-card absolute will-change-transform"
            style={{
              width: rowHeight,
              height: rowHeight,
              left: index * (rowHeight + gap),
            }}
          >
            <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
              <Image
                src={image.src}
                alt={image.alt || `Image ${index + 1}`}
                fill
                className="object-cover"
                loading="lazy"
                decoding="async"
                sizes={`${rowHeight}px`}
              />
            </div>
          </div>
        ))}
        {/* Duplication pour le défilement infini */}
        {images.map((image, index) => (
          <div
            key={`${image.id}-dup-${index}`}
            className="ribbon-card absolute will-change-transform"
            style={{
              width: rowHeight,
              height: rowHeight,
              left: (images.length + index) * (rowHeight + gap),
            }}
          >
            <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
              <Image
                src={image.src}
                alt={image.alt || `Image ${index + 1}`}
                fill
                className="object-cover"
                loading="lazy"
                decoding="async"
                sizes={`${rowHeight}px`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteRibbon;
