import { useWallpaperControl } from "../hooks/useWallpaperControl";
import { Image } from "lucide-react";

const WallpaperControls = () => {
  const { wallpaperEnabled, setWallpaperEnabled, wallpaperOpacity, setWallpaperOpacity } = useWallpaperControl();

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
        <Image className="w-4 h-4" /> Wallpaper
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm text-text-secondary">Show Wallpaper</label>
          <button
            onClick={() => setWallpaperEnabled(!wallpaperEnabled)}
            className={`w-12 h-6 rounded-full transition-colors ${
              wallpaperEnabled ? "bg-primary" : "bg-surface-secondary"
            }`}
            aria-label={`${wallpaperEnabled ? "Hide" : "Show"} wallpaper`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                wallpaperEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {wallpaperEnabled && (
          <div>
            <label className="text-sm text-text-secondary block mb-2">
              Opacity: {wallpaperOpacity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={wallpaperOpacity}
              onChange={(e) => setWallpaperOpacity(Number(e.target.value))}
              className="w-full h-2 bg-surface-secondary rounded-lg appearance-none cursor-pointer"
              aria-label="Wallpaper opacity"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WallpaperControls;
