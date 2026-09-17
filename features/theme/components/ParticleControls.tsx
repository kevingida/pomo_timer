import { useParticleControl } from "../hooks/useParticleControl";
import { Sparkles } from "lucide-react";

const ParticleControls = () => {
  const { particleType, setParticleType, particleOpacity, setParticleOpacity, particleSpeed, setParticleSpeed } = useParticleControl();
  const particleTypes: Array<"stars" | "rain" | "snow" | "fireflies" | "none"> = ["none", "stars", "rain", "snow", "fireflies"];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
        <Sparkles className="w-4 h-4" /> Particle Effects
      </h3>

      <div className="space-y-3">
        <div>
          <label className="text-sm text-text-secondary block mb-2">Effect Type</label>
          <div className="flex flex-wrap gap-2">
            {particleTypes.map((type) => (
              <button
                key={type}
                onClick={() => setParticleType(type)}
                className={`py-2 px-3 rounded text-xs font-medium transition-colors ${
                  particleType === type
                    ? "bg-primary text-white"
                    : "bg-surface-secondary text-text-secondary hover:bg-surface-active"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {particleType !== "none" && (
          <>
            <div>
              <label className="text-sm text-text-secondary block mb-2">
                Opacity: {particleOpacity}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={particleOpacity}
                onChange={(e) => setParticleOpacity(Number(e.target.value))}
                className="w-full h-2 bg-surface-secondary rounded-lg appearance-none cursor-pointer"
                aria-label="Particle opacity"
              />
            </div>

            <div>
              <label className="text-sm text-text-secondary block mb-2">Speed</label>
              <div className="flex gap-2">
                {["slow", "medium", "fast"].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setParticleSpeed(speed as "slow" | "medium" | "fast")}
                    className={`flex-1 py-2 px-3 rounded text-xs font-medium transition-colors ${
                      particleSpeed === speed
                        ? "bg-primary text-white"
                        : "bg-surface-secondary text-text-secondary hover:bg-surface-active"
                    }`}
                  >
                    {speed.charAt(0).toUpperCase() + speed.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ParticleControls;
