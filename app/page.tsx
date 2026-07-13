"use client";
import ThemeSelector from "@/features/theme/components/ThemeSelector";
import { useTheme } from "@/features/theme/hooks/useThemes";
import Timer from "@/features/timer";
import Task from "@/features/task";
import { useState } from "react";

export default function Home() {
  const [isTaskOpen, setIsTaskOpen] = useState(false);

  const toggleTask = (state?: boolean) => {
    setIsTaskOpen((prev) => state ?? !prev);
  };

  const { theme } = useTheme();
  return (
    <div
      className="flex flex-col flex-1 items-center justify-center bg-background font-sans bg-center bg-cover bg-no-repeat"
      style={{
        background: theme.variables["--background"]
          ? theme.variables["--background"]
          : `url(${theme.wallpaper}) center / cover no-repeat`,
      }}
    >
      <div className="absolute top-4 right-4 z-20 flex flex-row items-center gap-4">
        <ThemeSelector />
        <Task toggleTask={toggleTask} isTaskOpen={isTaskOpen} />
      </div>
      <Timer isTaskOpen={isTaskOpen} />
    </div>
  );
}
