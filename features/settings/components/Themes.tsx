import Button from "@/components/Button";
import { Brush, Check } from "lucide-react";
import { themes, ThemeName } from "@/features/theme/data";
import { useTheme } from "@/features/theme/hooks/useThemes";

const Themes = () => {
  const { themeName, setTheme } = useTheme();

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-4">
        <Brush className="w-5 h-5" /> Theme Settings
      </h2>

      <div className="grid grid-cols-1 gap-3 w-full">
        {Object.entries(themes).map(([key, theme]) => {
          const themeKey = key as ThemeName;
          const isActive = themeName === themeKey;

          return (
            <div key={themeKey} className="flex items-center gap-2">
              <Button
                onClick={() => setTheme(themeKey)}
                active={isActive}
                variant="primary"
                size="sm"
                className="flex items-center justify-between gap-3 text-left flex-1"
                aria-pressed={isActive}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span
                    aria-hidden="true"
                    className="w-10 h-8 shrink-0 rounded-md border border-white/20 bg-cover bg-center"
                    style={{
                      background: theme.wallpaper
                        ? `url('${theme.wallpaper}') center/cover`
                        : theme.variables["--background"]
                          ? theme.variables["--background"]
                          : `linear-gradient(135deg, ${
                              theme.variables["--gradient-primary"] ||
                              theme.variables["--surface-primary"]
                            }, ${theme.variables["--gradient-secondary"] || theme.variables["--surface-active"]})`,
                    }}
                  />
                  <span className="truncate">{theme.name}</span>
                </span>
                {isActive && <Check className="w-4 h-4 shrink-0" />}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Themes;
