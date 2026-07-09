"use client";

import { createContext, useEffect, useMemo, useState } from "react";

import { themes, ThemeName } from "@/features/theme/data";
import { Theme } from "../interface";

type ThemeContextType = {
  theme: Theme;
  themeName: ThemeName;

  setTheme: (theme: ThemeName) => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>("sereneForest");

  const theme = useMemo(() => themes[themeName], [themeName]);

  useEffect(() => {
    const root = document.documentElement;

    Object.entries(theme.variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme]);

  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved && saved in themes) {
      setThemeName(saved as ThemeName);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", themeName);
  }, [themeName]);

  return (
    <ThemeContext.Provider value={{ theme, themeName, setTheme: setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};
