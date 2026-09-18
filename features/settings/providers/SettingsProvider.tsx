"use client";
import React, { createContext, useCallback, useMemo } from "react";
import { Settings, SoundOption } from "../type";
import { SETTING_LIMITS } from "../constant";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

const STORAGE_KEY = "settings";

const defaultSettings: Settings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: true,
  autoStartPomodoros: false,
  soundEnabled: true,
  volume: 100,
  focusEndSound: "chime",
  breakEndSound: "chime",
};

const SOUND_OPTIONS: readonly SoundOption[] = ["chime", "bell", "tick"];

const clampNumber = (
  value: unknown,
  min: number,
  max: number,
  fallback: number,
) =>
  typeof value === "number" && Number.isFinite(value)
    ? Math.min(Math.max(value, min), max)
    : fallback;

const asBoolean = (value: unknown, fallback: boolean) =>
  typeof value === "boolean" ? value : fallback;

const asSound = (value: unknown, fallback: SoundOption) =>
  SOUND_OPTIONS.includes(value as SoundOption)
    ? (value as SoundOption)
    : fallback;

// Saved settings may predate newer keys or valid ranges; always merge onto defaults
const normalizeSettings = (saved: unknown, defaults: Settings): Settings => {
  if (!saved || typeof saved !== "object") return defaults;
  const s = saved as Partial<Record<keyof Settings, unknown>>;
  const limits = SETTING_LIMITS;

  return {
    focusDuration: clampNumber(
      s.focusDuration,
      limits.focusDuration.min,
      limits.focusDuration.max,
      defaults.focusDuration,
    ),
    shortBreakDuration: clampNumber(
      s.shortBreakDuration,
      limits.shortBreakDuration.min,
      limits.shortBreakDuration.max,
      defaults.shortBreakDuration,
    ),
    longBreakDuration: clampNumber(
      s.longBreakDuration,
      limits.longBreakDuration.min,
      limits.longBreakDuration.max,
      defaults.longBreakDuration,
    ),
    longBreakInterval: clampNumber(
      s.longBreakInterval,
      limits.longBreakInterval.min,
      limits.longBreakInterval.max,
      defaults.longBreakInterval,
    ),
    autoStartBreaks: asBoolean(s.autoStartBreaks, defaults.autoStartBreaks),
    autoStartPomodoros: asBoolean(
      s.autoStartPomodoros,
      defaults.autoStartPomodoros,
    ),
    soundEnabled: asBoolean(s.soundEnabled, defaults.soundEnabled),
    volume: clampNumber(s.volume, 0, 100, defaults.volume),
    focusEndSound: asSound(s.focusEndSound, defaults.focusEndSound),
    breakEndSound: asSound(s.breakEndSound, defaults.breakEndSound),
  };
};

type SettingsContextType = {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
};

export const SettingsContext = createContext<SettingsContextType | null>(null);

const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useLocalStorageState(
    STORAGE_KEY,
    defaultSettings,
    normalizeSettings,
  );

  const updateSettings = useCallback(
    (updates: Partial<Settings>) => {
      setSettings((prev) => ({ ...prev, ...updates }));
    },
    [setSettings],
  );

  const value = useMemo(
    () => ({ settings, updateSettings }),
    [settings, updateSettings],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
};

export default SettingsProvider;
