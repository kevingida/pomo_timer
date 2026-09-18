"use client";

import { useCallback, useEffect } from "react";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

type TextSize = "small" | "normal" | "large";
type AccessibilitySettings = {
  highContrast: boolean;
  reduceMotion: boolean;
  textSize: TextSize;
};

const STORAGE_KEY = "accessibilitySettings";
const TEXT_SIZES: readonly TextSize[] = ["small", "normal", "large"];
const defaultAccessibilitySettings: AccessibilitySettings = {
  highContrast: false,
  reduceMotion: false,
  textSize: "normal",
};

const prefers = (query: string) =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia(query).matches;

// System preferences take precedence over saved values
const normalizeAccessibilitySettings = (
  saved: unknown,
  defaults: AccessibilitySettings,
): AccessibilitySettings => {
  const s = (saved && typeof saved === "object" ? saved : {}) as Partial<
    Record<keyof AccessibilitySettings, unknown>
  >;
  return {
    highContrast:
      prefers("(prefers-contrast: more)") ||
      (typeof s.highContrast === "boolean"
        ? s.highContrast
        : defaults.highContrast),
    reduceMotion:
      prefers("(prefers-reduced-motion: reduce)") ||
      (typeof s.reduceMotion === "boolean"
        ? s.reduceMotion
        : defaults.reduceMotion),
    textSize: TEXT_SIZES.includes(s.textSize as TextSize)
      ? (s.textSize as TextSize)
      : defaults.textSize,
  };
};

export const useAccessibilitySettings = () => {
  const [settings, setSettings] = useLocalStorageState(
    STORAGE_KEY,
    defaultAccessibilitySettings,
    normalizeAccessibilitySettings,
  );

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("high-contrast", settings.highContrast);
    root.classList.toggle("reduce-motion", settings.reduceMotion);

    const fontSizeValue = {
      small: "14px",
      normal: "16px",
      large: "18px",
    }[settings.textSize];
    root.style.setProperty("--base-font-size", fontSizeValue);
  }, [settings]);

  const setHighContrast = useCallback(
    (highContrast: boolean) =>
      setSettings((prev) => ({ ...prev, highContrast })),
    [setSettings],
  );
  const setReduceMotion = useCallback(
    (reduceMotion: boolean) =>
      setSettings((prev) => ({ ...prev, reduceMotion })),
    [setSettings],
  );
  const setTextSize = useCallback(
    (textSize: TextSize) => setSettings((prev) => ({ ...prev, textSize })),
    [setSettings],
  );

  return {
    highContrast: settings.highContrast,
    setHighContrast,
    reduceMotion: settings.reduceMotion,
    setReduceMotion,
    textSize: settings.textSize,
    setTextSize,
  };
};
