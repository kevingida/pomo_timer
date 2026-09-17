import ParticleControls from "@/features/theme/components/ParticleControls";
import WallpaperControls from "@/features/theme/components/WallpaperControls";
import AccessibilitySettings from "@/features/theme/components/AccessibilitySettings";
import Themes from "./Themes";

const ThemeSettings = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Themes />
      </div>

      <div className="border-t border-border-primary pt-4 space-y-4">
        <ParticleControls />
      </div>

      {/* <div className="border-t border-border-primary pt-4 space-y-4">
        <WallpaperControls />
      </div>

      <div className="border-t border-border-primary pt-4 space-y-4">
        <AccessibilitySettings />
      </div> */}
    </div>
  );
};

export default ThemeSettings;
