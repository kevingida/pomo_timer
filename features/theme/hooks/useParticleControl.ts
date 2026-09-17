"use client";

import { useEffect, useState } from "react";

type ParticleType = "stars" | "rain" | "snow" | "fireflies" | "none";

export const useParticleControl = () => {
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

  return {
    particleType,
    setParticleType,
    particleOpacity,
    setParticleOpacity,
    particleSpeed,
    setParticleSpeed,
  };
};
