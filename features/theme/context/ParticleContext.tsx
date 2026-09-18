"use client";

import { createContext, useCallback, useContext, useMemo, ReactNode } from "react";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

type ParticleType = "stars" | "rain" | "snow" | "fireflies" | "none";
type ParticleSpeed = "slow" | "medium" | "fast";

type ParticleSettings = {
  type: ParticleType;
  opacity: number;
  speed: ParticleSpeed;
};

const STORAGE_KEY = "particleSettings";
const PARTICLE_TYPES: readonly ParticleType[] = [
  "stars",
  "rain",
  "snow",
  "fireflies",
  "none",
];
const PARTICLE_SPEEDS: readonly ParticleSpeed[] = ["slow", "medium", "fast"];

const defaultParticleSettings: ParticleSettings = {
  type: "none",
  opacity: 100,
  speed: "medium",
};

const normalizeParticleSettings = (
  saved: unknown,
  defaults: ParticleSettings,
): ParticleSettings => {
  if (!saved || typeof saved !== "object") return defaults;
  const s = saved as Partial<Record<keyof ParticleSettings, unknown>>;

  return {
    type: PARTICLE_TYPES.includes(s.type as ParticleType)
      ? (s.type as ParticleType)
      : defaults.type,
    opacity:
      typeof s.opacity === "number"
        ? Math.min(100, Math.max(0, s.opacity))
        : defaults.opacity,
    speed: PARTICLE_SPEEDS.includes(s.speed as ParticleSpeed)
      ? (s.speed as ParticleSpeed)
      : defaults.speed,
  };
};

interface ParticleContextType {
  particleType: ParticleType;
  setParticleType: (type: ParticleType) => void;
  particleOpacity: number;
  setParticleOpacity: (opacity: number) => void;
  particleSpeed: ParticleSpeed;
  setParticleSpeed: (speed: ParticleSpeed) => void;
}

const ParticleContext = createContext<ParticleContextType | undefined>(
  undefined,
);

export const ParticleProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useLocalStorageState(
    STORAGE_KEY,
    defaultParticleSettings,
    normalizeParticleSettings,
  );

  const setParticleType = useCallback(
    (type: ParticleType) => setSettings((prev) => ({ ...prev, type })),
    [setSettings],
  );
  const setParticleOpacity = useCallback(
    (opacity: number) => setSettings((prev) => ({ ...prev, opacity })),
    [setSettings],
  );
  const setParticleSpeed = useCallback(
    (speed: ParticleSpeed) => setSettings((prev) => ({ ...prev, speed })),
    [setSettings],
  );

  const value = useMemo(
    () => ({
      particleType: settings.type,
      setParticleType,
      particleOpacity: settings.opacity,
      setParticleOpacity,
      particleSpeed: settings.speed,
      setParticleSpeed,
    }),
    [settings, setParticleType, setParticleOpacity, setParticleSpeed],
  );

  return (
    <ParticleContext.Provider value={value}>{children}</ParticleContext.Provider>
  );
};

export const useParticleControl = () => {
  const context = useContext(ParticleContext);
  if (context === undefined) {
    throw new Error("useParticleControl must be used within ParticleProvider");
  }
  return context;
};
