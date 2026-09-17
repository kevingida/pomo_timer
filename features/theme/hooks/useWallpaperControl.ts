"use client";

import { useEffect, useState } from "react";

export const useWallpaperControl = () => {
  const [wallpaperEnabled, setWallpaperEnabled] = useState(true);
  const [wallpaperOpacity, setWallpaperOpacity] = useState(100);

  useEffect(() => {
    const saved = localStorage.getItem("wallpaperSettings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setWallpaperEnabled(parsed.enabled ?? true);
      setWallpaperOpacity(parsed.opacity ?? 100);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      "--wallpaper-opacity",
      String(wallpaperEnabled ? wallpaperOpacity / 100 : 0)
    );

    localStorage.setItem(
      "wallpaperSettings",
      JSON.stringify({
        enabled: wallpaperEnabled,
        opacity: wallpaperOpacity,
      })
    );
  }, [wallpaperEnabled, wallpaperOpacity]);

  return {
    wallpaperEnabled,
    setWallpaperEnabled,
    wallpaperOpacity,
    setWallpaperOpacity,
  };
};
