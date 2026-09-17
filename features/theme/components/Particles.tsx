"use client";

import { useEffect, useRef } from "react";
import "@/features/theme/styles/particles.css";

type ParticleType = "stars" | "rain" | "snow" | "fireflies" | "none";

interface ParticlesProps {
  type: ParticleType;
  opacity: number;
  speed: "slow" | "medium" | "fast";
}

const Particles = ({ type, opacity, speed }: ParticlesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || type === "none") return;

    const container = containerRef.current;
    container.innerHTML = "";

    const particleCount = type === "fireflies" ? 30 : type === "rain" ? 100 : 60;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = `particle particle-${type}`;

      if (type === "stars") {
        particle.style.left = Math.random() * 100 + "%";
        particle.style.top = Math.random() * 100 + "%";
        particle.style.width = Math.random() * 2 + 1 + "px";
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 2 + "s";
      } else if (type === "rain") {
        particle.style.left = Math.random() * 100 + "%";
        particle.style.top = Math.random() * -100 + "%";
        particle.style.height = Math.random() * 10 + 10 + "px";
        particle.style.width = "1px";
        particle.style.animationDelay = Math.random() * 2 + "s";
      } else if (type === "snow") {
        particle.style.left = Math.random() * 100 + "%";
        particle.style.top = Math.random() * -100 + "%";
        particle.style.width = Math.random() * 6 + 3 + "px";
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 3 + "s";
      } else if (type === "fireflies") {
        particle.style.left = Math.random() * 100 + "%";
        particle.style.top = Math.random() * 100 + "%";
        particle.style.width = "4px";
        particle.style.height = "4px";
        particle.style.animationDelay = Math.random() * 4 + "s";
      }

      container.appendChild(particle);
    }
  }, [type]);

  if (type === "none") return null;

  return (
    <div
      ref={containerRef}
      className={`particles-container particles-${type}`}
      style={{
        "--particle-opacity": opacity / 100,
        "--particle-speed": speed === "slow" ? "slow" : speed === "medium" ? "medium" : "fast",
      } as React.CSSProperties & Record<string, string | number>}
    />
  );
};

export default Particles;
