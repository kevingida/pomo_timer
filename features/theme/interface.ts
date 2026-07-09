export interface Theme {
  id: string;

  name: string;

  wallpaper?: string;

  particles: "stars" | "rain" | "snow" | "fireflies" | "none";

  music: string;

  variables: Record<string, string>;
}
