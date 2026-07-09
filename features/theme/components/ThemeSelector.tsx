"use client";
import Button from "@/components/Button";
import { Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../hooks/useThemes";
import { themes } from "@/features/theme/data";

const ThemeSelector = () => {
  const [open, setOpen] = useState(false);

  const { setTheme, themeName } = useTheme();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Button onClick={() => setOpen(!open)} tooltip="Themes">
        <Palette />
      </Button>
      {open && (
        <div className="absolute top-full right-0 mt-2 flex flex-col gap-2 rounded-[20px] backdrop-blur-lg bg-transparent p-2 shadow-lg">
          {Object.keys(themes).map((theme) => (
            <Button
              key={theme}
              onClick={() => setTheme(theme as keyof typeof themes)}
              variant={"primary"}
              active={themeName === theme}
              size="sm"
            >
              {theme}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
