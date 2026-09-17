export interface Theme {
  id: string;
  name: string;
  description?: string;
  category?: 'preset' | 'custom';
  wallpaper?: string;
  particles: "stars" | "rain" | "snow" | "fireflies" | "none";
  particleOpacity?: number;
  particleSpeed?: 'slow' | 'medium' | 'fast';
  music: string;
  soundVolume?: number;
  variables: Record<string, string>;
  highContrast?: boolean;
  reduceMotion?: boolean;
  fontSize?: 'small' | 'normal' | 'large';
  author?: string;
  tags?: string[];
  createdAt?: string;
  isFavorite?: boolean;
}
