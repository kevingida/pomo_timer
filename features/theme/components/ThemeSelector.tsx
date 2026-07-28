"use client";
import Button from "@/components/Button";
import { Palette } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTheme } from "../hooks/useThemes";
import { themes } from "@/features/theme/data";
import Tooltip from "@/components/Tooltip";
import useScreenSize from "@/hooks/useScreenSize";

interface ThemeSelectorProps {
  toggleDropdown: (type: string) => void;
  isThemeOpen: boolean;
}

const ThemeSelector = ({ toggleDropdown, isThemeOpen }: ThemeSelectorProps) => {
  const { setTheme, themeName } = useTheme();

  const { sm } = useScreenSize();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isThemeOpen) return; // only listen while open
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        toggleDropdown("theme");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className={`${sm ? "relative " : ""}`}>
      <Tooltip content="Select Theme">
        <Button onClick={() => toggleDropdown("theme")}>
          <Palette />
        </Button>
      </Tooltip>
      {isThemeOpen && (
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
