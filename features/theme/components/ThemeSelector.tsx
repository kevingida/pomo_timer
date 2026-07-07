"use client";
import Button from "@/components/Button";
import { Palette } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../hooks/useThemes";
import { themes } from "@/features/theme/data";

const ThemeSelector = () => {
  const [open, setOpen] = useState(false);

  const { setTheme, themeName } = useTheme();

  return (
    <div className="relative">
      <Button onClick={() => setOpen(!open)}>
        <Palette />
      </Button>
      {open && (
        <div className="absolute top-full right-0 mt-2 flex flex-col gap-2 rounded-[10px] bg-black/30 p-2 shadow-lg">
          {Object.keys(themes).map((theme) => (
            <Button
              key={theme}
              onClick={() => setTheme(theme as keyof typeof themes)}
              variant={"primary"}
              active={themeName === theme}
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
