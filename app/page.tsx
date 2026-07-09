"use client";
import ThemeSelector from "@/features/theme/components/ThemeSelector";
import { useTheme } from "@/features/theme/hooks/useThemes";
import Timer from "@/features/timer";

export default function Home() {
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
      <div className="absolute top-4 right-4">
        <ThemeSelector />
      </div>
      <Timer />
    </div>
  );
}
