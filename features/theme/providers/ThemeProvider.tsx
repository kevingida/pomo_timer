"use client";

import { createContext, useEffect, useMemo } from "react";

import { themes, ThemeName } from "@/features/theme/data";
import { Theme } from "../interface";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

type ThemeContextType = {
  theme: Theme;
  themeName: ThemeName;

  setTheme: (theme: ThemeName) => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = "theme";
const DEFAULT_THEME: ThemeName = "sereneForest";

const normalizeThemeName = (saved: unknown, defaults: ThemeName): ThemeName =>
  typeof saved === "string" && saved in themes ? (saved as ThemeName) : defaults;

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeName] = useLocalStorageState(
    STORAGE_KEY,
    DEFAULT_THEME,
    normalizeThemeName,
  );

  const theme = useMemo(() => themes[themeName], [themeName]);

  useEffect(() => {
    const root = document.documentElement;

    Object.entries(theme.variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme]);

  const value = useMemo(
    () => ({ theme, themeName, setTheme: setThemeName }),
    [theme, themeName, setThemeName],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
