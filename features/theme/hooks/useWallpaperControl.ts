"use client";

import { useCallback, useEffect } from "react";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

type WallpaperSettings = { enabled: boolean; opacity: number };

const STORAGE_KEY = "wallpaperSettings";
const defaultWallpaperSettings: WallpaperSettings = { enabled: true, opacity: 100 };

const normalizeWallpaperSettings = (
  saved: unknown,
  defaults: WallpaperSettings,
): WallpaperSettings => {
  if (!saved || typeof saved !== "object") return defaults;
  const s = saved as Partial<Record<keyof WallpaperSettings, unknown>>;
  return {
    enabled: typeof s.enabled === "boolean" ? s.enabled : defaults.enabled,
    opacity:
      typeof s.opacity === "number"
        ? Math.min(100, Math.max(0, s.opacity))
        : defaults.opacity,
  };
};

export const useWallpaperControl = () => {
  const [settings, setSettings] = useLocalStorageState(
    STORAGE_KEY,
    defaultWallpaperSettings,
    normalizeWallpaperSettings,
  );

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--wallpaper-opacity",
      String(settings.enabled ? settings.opacity / 100 : 0),
    );
  }, [settings]);

  const setWallpaperEnabled = useCallback(
    (enabled: boolean) => setSettings((prev) => ({ ...prev, enabled })),
    [setSettings],
  );
  const setWallpaperOpacity = useCallback(
    (opacity: number) => setSettings((prev) => ({ ...prev, opacity })),
    [setSettings],
  );

  return {
    wallpaperEnabled: settings.enabled,
    setWallpaperEnabled,
    wallpaperOpacity: settings.opacity,
    setWallpaperOpacity,
  };
};
