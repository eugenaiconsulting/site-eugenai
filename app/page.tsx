import React from 'react';
import FiveZoneShowcase, { Img } from '@/components/FiveZoneShowcase';
import TestimonialsRow from '@/components/TestimonialsRow';

// Images de démo pour la galerie 5 zones
const showcaseImages: Img[] = [
  {
    id: 'showcase-1',
    src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center',
    alt: 'Data visualization dashboard with charts and analytics'
  },
  {
    id: 'showcase-2', 
    src: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop&crop=center',
    alt: 'Code editor with syntax highlighting'
  },
  {
    id: 'showcase-3',
    src: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop&crop=center',
    alt: 'Humanoid robot with tablet interaction'
  },
  {
    id: 'showcase-4',
    src: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&crop=center',
    alt: 'Machine learning and AI visualization'
  },
  {
    id: 'showcase-5',
    src: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop&crop=center',
    alt: 'Digital transformation and innovation'
  }
];

// Données des témoignages
const testimonialsData = [
  {
    avatarSrc: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    name: 'VK',
    ideas: 100,
    quote: 'Using Dream Machine was a game changer for me. It transformed the way I work with AI, allowing me to treat it as a true co-creator. The platform brought a new level of flexibility to the AI generation process, making it easier to refine and iterate on my creative ideas.'
  },
  {
    avatarSrc: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    name: 'Melanie Petschke',
    ideas: 54,
    quote: 'Dream Machine helps me to express what I can\'t put into words. The various features allow me to visualize different perspectives of my idea until I have a result that corresponds to the feeling or vibe I want to show.'
  },
  {
    avatarSrc: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    name: 'Marleigh Jones',
    ideas: 94,
    quote: 'Some of the most tedious work when generating AI Images and Videos is keeping all your ideas organized. It\'s easy to get lost in everything but with Dream Machine and the boards the work flow is seamless. It\'s such an intuitive platform.'
  }
];

export default function Home() {
  return (
    <main 
      className="min-h-screen"
      style={{ backgroundColor: 'var(--page-bg)' }}
    >
      {/* Section Five Zone Showcase */}
      <section className="w-full py-20">
        <FiveZoneShowcase
          images={showcaseImages}
          height={1000}
          gap={24}
          activeScale={1.08}
          inactiveOpacity={0.4}
          className="md:h-[800px] lg:h-[1000px]"
        />
      </section>

      {/* Section Témoignages */}
      <section className="py-20">
        <TestimonialsRow items={testimonialsData} />
      </section>
    </main>
  );
}