import { useAccessibilitySettings } from "../hooks/useAccessibilitySettings";
import { Eye, Volume2 } from "lucide-react";

const AccessibilitySettings = () => {
  const { highContrast, setHighContrast, reduceMotion, setReduceMotion, textSize, setTextSize } = useAccessibilitySettings();

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
        <Eye className="w-4 h-4" /> Accessibility
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm text-text-secondary">High Contrast</label>
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`w-12 h-6 rounded-full transition-colors ${
              highContrast ? "bg-primary" : "bg-surface-secondary"
            }`}
            aria-label={`${highContrast ? "Disable" : "Enable"} high contrast mode`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                highContrast ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm text-text-secondary">Reduce Motion</label>
          <button
            onClick={() => setReduceMotion(!reduceMotion)}
            className={`w-12 h-6 rounded-full transition-colors ${
              reduceMotion ? "bg-primary" : "bg-surface-secondary"
            }`}
            aria-label={`${reduceMotion ? "Disable" : "Enable"} reduced motion`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                reduceMotion ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div>
          <label className="text-sm text-text-secondary block mb-2">Text Size</label>
          <div className="flex gap-2">
            {["small", "normal", "large"].map((size) => (
              <button
                key={size}
                onClick={() => setTextSize(size as "small" | "normal" | "large")}
                className={`flex-1 py-2 px-3 rounded text-xs font-medium transition-colors ${
                  textSize === size
                    ? "bg-primary text-white"
                    : "bg-surface-secondary text-text-secondary hover:bg-surface-active"
                }`}
              >
                <span className={size === "small" ? "text-xs" : size === "large" ? "text-lg" : "text-base"}>
                  A
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilitySettings;
