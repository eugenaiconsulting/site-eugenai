'use client';

import React from 'react';
import { Img } from './InfiniteRibbon';

interface BoardCardProps {
  titleSmall: string;
  titleBold: string;
  ideasCount: number;
  thumbs: Img[];
  gradient: string;
  className?: string;
}

const BoardCard: React.FC<BoardCardProps> = ({
  titleSmall,
  titleBold,
  ideasCount,
  thumbs,
  gradient,
  className = ''
}) => {
  return (
    <div
      className={`relative rounded-[32px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.10)] overflow-hidden ${className}`}
      style={{
        background: gradient,
        height: '320px',
        minHeight: '280px'
      }}
    >
      {/* Contenu principal */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Titre */}
        <div className="space-y-2">
          <div className="text-white/80 text-sm font-medium tracking-wide uppercase">
            {titleSmall}
          </div>
          <div className="text-white font-extrabold text-3xl sm:text-4xl leading-tight">
            {titleBold}
          </div>
        </div>

        {/* Compteur d'idées */}
        <div className="text-white/70 text-sm font-medium">
          {ideasCount} ideas
        </div>
      </div>

      {/* Stack de vignettes en bas à droite */}
      <div className="absolute bottom-6 right-6 z-20">
        <div className="relative">
          {/* Vignette arrière */}
          {thumbs[2] && (
            <div 
              className="absolute w-16 h-16 rounded-lg overflow-hidden shadow-lg"
              style={{
                transform: 'translate(8px, 8px) rotate(-8deg)',
                zIndex: 1
              }}
            >
              <img
                src={thumbs[2].src}
                alt={thumbs[2].alt || 'Thumbnail 3'}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
          
          {/* Vignette milieu */}
          {thumbs[1] && (
            <div 
              className="absolute w-16 h-16 rounded-lg overflow-hidden shadow-lg"
              style={{
                transform: 'translate(4px, 4px) rotate(-4deg)',
                zIndex: 2
              }}
            >
              <img
                src={thumbs[1].src}
                alt={thumbs[1].alt || 'Thumbnail 2'}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
          
          {/* Vignette avant */}
          {thumbs[0] && (
            <div 
              className="relative w-16 h-16 rounded-lg overflow-hidden shadow-lg"
              style={{
                transform: 'rotate(2deg)',
                zIndex: 3
              }}
            >
              <img
                src={thumbs[0].src}
                alt={thumbs[0].alt || 'Thumbnail 1'}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
        </div>
      </div>

      {/* Overlay subtil pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10 pointer-events-none" />
    </div>
  );
};

export default BoardCard;
