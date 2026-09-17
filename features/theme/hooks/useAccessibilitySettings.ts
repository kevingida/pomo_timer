"use client";

import { useEffect, useState } from "react";

type TextSize = "small" | "normal" | "large";

export const useAccessibilitySettings = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [textSize, setTextSize] = useState<TextSize>("normal");

  useEffect(() => {
    const saved = localStorage.getItem("accessibilitySettings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setHighContrast(parsed.highContrast ?? false);
      setReduceMotion(parsed.reduceMotion ?? false);
      setTextSize(parsed.textSize ?? "normal");
    }

    // Check system preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduceMotion(true);
    }
    if (window.matchMedia("(prefers-contrast: more)").matches) {
      setHighContrast(true);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    if (reduceMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }

    const fontSizeValue = {
      small: "14px",
      normal: "16px",
      large: "18px",
    }[textSize];
    root.style.setProperty("--base-font-size", fontSizeValue);

    localStorage.setItem(
      "accessibilitySettings",
      JSON.stringify({
        highContrast,
        reduceMotion,
        textSize,
      })
    );
  }, [highContrast, reduceMotion, textSize]);

  return {
    highContrast,
    setHighContrast,
    reduceMotion,
    setReduceMotion,
    textSize,
    setTextSize,
  };
};
