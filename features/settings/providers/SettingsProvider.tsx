"use client";
import React, { createContext, useEffect, useState } from "react";
import { Settings } from "../type";

const STORAGE_KEY = "settings";

const defaultSettings: Settings = {
  focusDuration: 0.1,
  shortBreakDuration: 0.1,
  longBreakDuration: 0.1,
  longBreakInterval: 4,
  autoStartBreaks: true,
  autoStartPomodoros: false,
  soundEnabled: true,
};

type SettingsContextType = {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
};

export const SettingsContext = createContext<SettingsContextType | null>(null);

const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const [loaded, setLoaded] = useState(false);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      setSettings(JSON.parse(saved));
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings, loaded]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
