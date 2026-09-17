import NumberInput from "@/components/NumberInput";
import Slider from "@/components/Slider";
import { useParticleControl } from "../hooks/useParticleControl";
import { Sparkles } from "lucide-react";
import Button from "@/components/Button";

const ParticleControls = () => {
  const {
    particleType,
    setParticleType,
    particleOpacity,
    setParticleOpacity,
    particleSpeed,
    setParticleSpeed,
  } = useParticleControl();
  const particleTypes: Array<"stars" | "rain" | "snow" | "fireflies" | "none"> =
    ["none", "stars", "rain", "snow", "fireflies"];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
        <Sparkles className="w-4 h-4" /> Particle Effects
      </h3>

      <div className="space-y-3">
        <div>
          <label className="text-sm text-text-secondary block mb-2">
            Effect Type
          </label>
          <div className="flex flex-wrap gap-2">
            {particleTypes.map((type) => (
              <Button
                key={type}
                variant="primary"
                active={particleType === type}
                onClick={() => setParticleType(type)}
                size="sm"
                className="py-2 px-3 rounded text-xs font-medium transition-colors hover:bg-surface-active"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {particleType !== "none" && (
          <>
            <div className="flex flex-col gap-1 w-full">
              <div className="flex flex-row gap-2 items-center justify-between w-full">
                <span className="text-sm font-semibold text-text-primary">
                  Opacity
                </span>
                <NumberInput
                  value={particleOpacity}
                  min={0}
                  max={100}
                  unit="%"
                  onChange={(value) => setParticleOpacity(value)}
                  onCommit={(value) => setParticleOpacity(value)}
                />
              </div>
              <Slider
                min={0}
                max={100}
                value={particleOpacity}
                onChange={(value) => setParticleOpacity(value)}
              />
            </div>

            <div>
              <label className="text-sm text-text-secondary block mb-2">
                Speed
              </label>
              <div className="flex gap-2">
                {["slow", "medium", "fast"].map((speed) => (
                  <Button
                    key={speed}
                    variant="primary"
                    size="sm"
                    active={particleSpeed === speed}
                    onClick={() =>
                      setParticleSpeed(speed as "slow" | "medium" | "fast")
                    }
                    className="flex-1 py-2 px-3 rounded text-xs font-medium transition-colors hover:bg-surface-active"
                  >
                    {speed.charAt(0).toUpperCase() + speed.slice(1)}
                  </Button>
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
