"use client";
import Button from "@/components/Button";
import { Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../hooks/useThemes";
import { themes } from "@/features/theme/data";
import Tooltip from "@/components/Tooltip";

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
      <Tooltip content="Select Theme">
        <Button onClick={() => setOpen(!open)}>
          <Palette />
        </Button>
      </Tooltip>
      {open && (
        <div className="absolute top-full right-0 mt-2 z-10 flex flex-col gap-2 rounded-[20px] backdrop-blur-lg bg-transparent p-2 shadow-lg">
          {Object.entries(themes).map(([themeKey, theme]) => (
            <Button
              key={themeKey}
              onClick={() => setTheme(themeKey as keyof typeof themes)}
              variant={"primary"}
              active={themeName === themeKey}
              size="sm"
              className="text-nowrap"
            >
              {theme.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
