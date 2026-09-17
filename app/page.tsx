"use client";
import ThemeSelector from "@/features/theme/components/ThemeSelector";
import { useTheme } from "@/features/theme/hooks/useThemes";
import Timer from "@/features/timer";
import Task from "@/features/task";
import { useState } from "react";
import Settings from "@/features/settings";
import Particles from "@/features/theme/components/Particles";
import { useParticleControl } from "@/features/theme/hooks/useParticleControl";

export default function Home() {
  const [openDropdown, setOpenDropdown] = useState({
    type: "",
    isOpen: false,
  });

  const toggleDropdown = (type: string) => {
    setOpenDropdown((prev) => ({
      type,
      isOpen: prev.type === type ? !prev.isOpen : true,
    }));
  };

  const { theme } = useTheme();
  const { particleType, particleOpacity, particleSpeed } = useParticleControl();

  return (
    <div
      className="flex flex-col flex-1 items-center justify-center bg-background font-sans bg-center bg-cover bg-no-repeat"
      style={{
        background: theme.variables["--background"]
          ? theme.variables["--background"]
          : `url(${theme.wallpaper}) center / cover no-repeat`,
      }}
    >
      <Particles type={particleType} opacity={particleOpacity} speed={particleSpeed} />
      <div className="absolute top-4 right-4 z-20 flex flex-row items-center gap-4">
        <ThemeSelector
          toggleDropdown={toggleDropdown}
          isThemeOpen={openDropdown.isOpen && openDropdown.type === "theme"}
        />
        <Task
          toggleDropdown={toggleDropdown}
          isTaskOpen={openDropdown.isOpen && openDropdown.type === "task"}
        />
        <Settings
          toggleDropdown={toggleDropdown}
          isSettingsOpen={
            openDropdown.isOpen && openDropdown.type === "settings"
          }
        />
      </div>
      <Timer
        isDropdownOpen={openDropdown.isOpen && openDropdown.type !== "theme"}
      />
    </div>
  );
}
