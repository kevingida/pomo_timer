"use client";

import { useEffect, useState } from "react";

type ParticleType = "stars" | "rain" | "snow" | "fireflies" | "none";

export const useParticleControl = () => {
  const [particleType, setParticleType] = useState<ParticleType>("none");
  const [particleOpacity, setParticleOpacity] = useState(100);
  const [particleSpeed, setParticleSpeed] = useState<"slow" | "medium" | "fast">("medium");

  useEffect(() => {
    const saved = localStorage.getItem("particleSettings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setParticleType(parsed.type ?? "none");
      setParticleOpacity(parsed.opacity ?? 100);
      setParticleSpeed(parsed.speed ?? "medium");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "particleSettings",
      JSON.stringify({
        type: particleType,
        opacity: particleOpacity,
        speed: particleSpeed,
      })
    );
  }, [particleType, particleOpacity, particleSpeed]);

  return {
    particleType,
    setParticleType,
    particleOpacity,
    setParticleOpacity,
    particleSpeed,
    setParticleSpeed,
  };
};
