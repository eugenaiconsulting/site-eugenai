import { Img } from '@/components/InfiniteRibbon';

/**
 * Répète un tableau d'images plusieurs fois pour créer un défilement infini fluide
 */
export function repeatImages(images: Img[], times: number = 3): Img[] {
  const repeated: Img[] = [];
  for (let i = 0; i < times; i++) {
    images.forEach((img, index) => {
      repeated.push({
        ...img,
        id: `${img.id}-${i}-${index}`
      });
    });
  }
  return repeated;
}

/**
 * Génère des images de démo avec des URLs Unsplash variées
 */
export function generateDemoImages(): Img[] {
  const baseImages = [
    'photo-1677442136019-21780ecad995', // IA et innovation
    'photo-1551288049-bebda4e38f71', // Data science
    'photo-1555949963-aa79dcee981c', // Machine learning
    'photo-1485827404703-89b55fcc595e', // Intelligence artificielle
    'photo-1518709268805-4e9042af2176', // Innovation technologique
    'photo-1551650975-87deedd944c3', // Solutions digitales
    'photo-1551288049-bebda4e38f71', // Transformation digitale
    'photo-1555949963-aa79dcee981c', // Automatisation
    'photo-1485827404703-89b55fcc595e', // Algorithmes avancés
    'photo-1518709268805-4e9042af2176', // Intelligence artificielle
    'photo-1551650975-87deedd944c3', // Innovation
    'photo-1551288049-bebda4e38f71', // Technologie
    'photo-1555949963-aa79dcee981c', // Data
    'photo-1485827404703-89b55fcc595e', // Analytics
    'photo-1518709268805-4e9042af2176', // Machine learning
    'photo-1551650975-87deedd944c3', // IA
    'photo-1551288049-bebda4e38f71', // Innovation
    'photo-1555949963-aa79dcee981c', // Technologie
    'photo-1485827404703-89b55fcc595e', // Data science
    'photo-1518709268805-4e9042af2176', // Intelligence artificielle
    'photo-1551650975-87deedd944c3', // Solutions digitales
    'photo-1551288049-bebda4e38f71', // Transformation digitale
    'photo-1555949963-aa79dcee981c', // Automatisation
    'photo-1485827404703-89b55fcc595e', // Algorithmes avancés
  ];

  return baseImages.map((imageId, index) => ({
    id: `demo-${index + 1}`,
    src: `https://images.unsplash.com/${imageId}?w=400&h=400&fit=crop&crop=center`,
    alt: `Image de démo ${index + 1}`
  }));
}
