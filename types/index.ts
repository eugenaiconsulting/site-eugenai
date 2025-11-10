export interface ImageItem {
  id: string;
  src: string;
  alt?: string;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface AboutUsSlideProps {
  title?: string;
  subtitle?: string;
  images: ImageItem[];
  stats?: StatItem[];
  theme?: 'light' | 'dark';
  rowHeight?: number;
  gap?: number;
  baseSpeed?: number;
  maxSpeed?: number;
  accentColor?: string;
}

export type Theme = 'light' | 'dark';

export interface AnimationState {
  offset: number;
  velocity: number;
  isDragging: boolean;
  lastMouseX: number;
  dragStart: number;
  lastTime: number;
}
