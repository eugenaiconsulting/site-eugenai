'use client';

import React from 'react';
import Image from 'next/image';

interface TestimonialItem {
  avatarSrc: string;
  name: string;
  ideas: number;
  quote: string;
}

interface TestimonialsRowProps {
  items: TestimonialItem[];
  className?: string;
}

const TestimonialsRow: React.FC<TestimonialsRowProps> = ({
  items,
  className = ''
}) => {
  return (
    <div className={`w-full max-w-7xl mx-auto px-6 lg:px-10 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center space-y-4"
          >
            {/* Avatar */}
            <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-lg">
              <Image
                src={item.avatarSrc}
                alt={`Avatar de ${item.name}`}
                fill
                className="object-cover"
                loading="lazy"
                decoding="async"
                sizes="64px"
              />
            </div>

            {/* Nom */}
            <div className="font-semibold text-lg text-gray-900">
              {item.name}
            </div>

            {/* Compteur d'idées */}
            <div className="text-sm text-gray-500 font-medium">
              {item.ideas} ideas
            </div>

            {/* Citation */}
            <div className="text-gray-600 text-sm leading-relaxed max-w-[70ch]">
              {item.quote}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsRow;
