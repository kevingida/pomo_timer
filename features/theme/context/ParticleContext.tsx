"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ParticleType = "stars" | "rain" | "snow" | "fireflies" | "none";

interface ParticleContextType {
  particleType: ParticleType;
  setParticleType: (type: ParticleType) => void;
  particleOpacity: number;
  setParticleOpacity: (opacity: number) => void;
  particleSpeed: "slow" | "medium" | "fast";
  setParticleSpeed: (speed: "slow" | "medium" | "fast") => void;
}

const ParticleContext = createContext<ParticleContextType | undefined>(undefined);

export const ParticleProvider = ({ children }: { children: ReactNode }) => {
  const [particleType, setParticleType] = useState<ParticleType>("none");
  const [particleOpacity, setParticleOpacity] = useState(100);
  const [particleSpeed, setParticleSpeed] = useState<"slow" | "medium" | "fast">("medium");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("particleSettings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const validTypes: ParticleType[] = ["stars", "rain", "snow", "fireflies", "none"];
        const type = validTypes.includes(parsed.type) ? parsed.type : "none";
        const opacity = typeof parsed.opacity === "number" ? Math.min(100, Math.max(0, parsed.opacity)) : 100;
        const speed = ["slow", "medium", "fast"].includes(parsed.speed) ? parsed.speed : "medium";

        setParticleType(type);
        setParticleOpacity(opacity);
        setParticleSpeed(speed);
      } catch (e) {
        console.error("Failed to parse particle settings:", e);
        localStorage.removeItem("particleSettings");
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(
      "particleSettings",
      JSON.stringify({
        type: particleType,
        opacity: particleOpacity,
        speed: particleSpeed,
      })
    );
  }, [particleType, particleOpacity, particleSpeed, isLoaded]);

  return (
    <ParticleContext.Provider
      value={{
        particleType,
        setParticleType,
        particleOpacity,
        setParticleOpacity,
        particleSpeed,
        setParticleSpeed,
      }}
    >
      {children}
    </ParticleContext.Provider>
  );
};

export const useParticleControl = () => {
  const context = useContext(ParticleContext);
  if (context === undefined) {
    throw new Error("useParticleControl must be used within ParticleProvider");
  }
  return context;
};
