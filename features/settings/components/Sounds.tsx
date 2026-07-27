import Dropdown from "@/components/Dropdown";
import { Bell, Coffee, Play, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";
import useSettings from "../hooks/useSettings";
import useSound from "@/features/timer/hooks/useSound";
import NumberInput from "@/components/NumberInput";
import Slider from "@/components/Slider";
import useScreenSize from "@/hooks/useScreenSize";
const soundOptions = [
  {
    label: "Chime",
    value: "chime",
  },
  {
    label: "Bell",
    value: "bell",
  },
  {
    label: "Tick",
    value: "tick",
  },
];

type SoundOptionValue = "chime" | "bell" | "tick";

const Sounds = () => {
  const { settings, updateSettings } = useSettings();
  const { handlePlaySound } = useSound();

  const { sm } = useScreenSize();

  const [focusEndSound, setFocusEndSound] = useState<SoundOptionValue>(
    settings.focusEndSound,
  );
  const [breakEndSound, setBreakEndSound] = useState<SoundOptionValue>(
    settings.breakEndSound,
  );
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [volume, setVolume] = useState(settings.volume);

  const handleSoundChange = (
    section: "focusEndSound" | "breakEndSound",
    value: SoundOptionValue,
  ) => {
    updateSettings({ [section]: value as SoundOptionValue });
    if (section === "focusEndSound") {
      setFocusEndSound(value);
    } else {
      setBreakEndSound(value);
    }
  };

  const handleTestSound = (section: "focusEndSound" | "breakEndSound") => {
    handlePlaySound(
      section === "focusEndSound" ? focusEndSound : breakEndSound,
    );
    setPlayingKey(section);
    setTimeout(() => setPlayingKey(null), 400);
  };

  const previousVolumeRef = useRef(settings.volume);

  const handleMuteToggle = () => {
    const newSoundEnabled = !soundEnabled;

    if (!newSoundEnabled) {
      previousVolumeRef.current = volume;
      handleVolumeChange(0);
    } else {
      handleVolumeChange(previousVolumeRef.current || 50); // fallback if it was somehow 0
    }

    setSoundEnabled(newSoundEnabled);
    updateSettings({ soundEnabled: newSoundEnabled });
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    updateSettings({ volume: value });

    // Dragging the slider while muted should un-mute automatically
    if (value > 0 && !soundEnabled) {
      setSoundEnabled(true);
      updateSettings({ soundEnabled: true });
    }
  };

  return (
    <div>
      <h2 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-4 overflow-visible">
        <Volume2 className="w-5 h-5" /> Sound Settings
      </h2>
      <div className="flex flex-col gap-5 w-full">
        <div className="flex flex-row justify-between gap-4 mt-2 w-full items-center">
          <div className="flex flex-row gap-4 items-center">
            <div className="flex w-fit h-fit p-2 rounded-full bg-white/5 items-center justify-center">
              <Bell className="w-6 h-6 text-text-primary" />
            </div>
            <label
              className="text-sm font-semibold text-text-primary"
              htmlFor="focusEndSound"
            >
              Focus End
            </label>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Dropdown
              id="focusEndSound"
              value={focusEndSound}
              options={soundOptions}
              onChange={(value) =>
                handleSoundChange("focusEndSound", value as SoundOptionValue)
              }
            />
            <div
              className={`flex w-fit h-fit p-2 rounded-full bg-white/5 items-center justify-center cursor-pointer transition-transform duration-150 hover:bg-white/10 ${
                playingKey === "focusEndSound"
                  ? "scale-90 bg-white/15"
                  : "scale-100"
              }`}
              onClick={() => handleTestSound("focusEndSound")}
            >
              <Play className="w-6 h-6 text-text-primary" />
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between gap-4 mt-2 w-full items-center">
          <div className="flex flex-row gap-4 items-center">
            <div className="flex w-fit h-fit p-2 rounded-full bg-white/5 items-center justify-center">
              <Coffee className="w-6 h-6 text-text-primary" />
            </div>
            <label
              className="text-sm font-semibold text-text-primary"
              htmlFor="breakEndSound"
            >
              Break End
            </label>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Dropdown
              id="breakEndSound"
              value={breakEndSound}
              options={soundOptions}
              onChange={(value) =>
                handleSoundChange("breakEndSound", value as SoundOptionValue)
              }
            />
            <div
              className={`flex w-fit h-fit p-2 rounded-full bg-white/5 items-center justify-center cursor-pointer transition-transform duration-150 hover:bg-white/10 ${
                playingKey === "breakEndSound"
                  ? "scale-90 bg-white/15"
                  : "scale-100"
              }`}
              onClick={() => handleTestSound("breakEndSound")}
            >
              <Play className="w-6 h-6 text-text-primary" />
            </div>
          </div>
        </div>
        <div className="h-px bg-surface-active/40 rounded-full mt-4" />
        {/* <div className="flex flex-row justify-between gap-4 mt-2 w-full items-center">
          <div className="flex flex-row gap-4 items-center">
            <div
              className="flex w-fit h-fit p-2 rounded-full bg-white/5 items-center justify-center"
              onClick={handleMuteToggle}
              id="volume"
            >
              {settings.soundEnabled ? (
                <Volume2 className="w-6 h-6 text-text-primary" />
              ) : (
                <VolumeX className="w-6 h-6 text-text-primary" />
              )}
            </div>
            <label
              className="text-sm font-semibold text-text-primary"
              htmlFor="volume"
            >
              Master Volume
            </label>
          </div>

        </div> */}
        <div className="flex flex-col w-full">
          <div className="flex flex-row gap-4 mt-2 justify-center items-center">
            <div
              className="flex w-fit h-fit p-2 rounded-full bg-white/5 items-center justify-center"
              onClick={handleMuteToggle}
              id="volume"
            >
              {settings.soundEnabled ? (
                <Volume2 className="w-6 h-6 text-text-primary" />
              ) : (
                <VolumeX className="w-6 h-6 text-text-primary" />
              )}
            </div>
            <div className="flex flex-col gap-1 w-full">
              <div className="flex flex-row gap-2 items-center justify-between w-full">
                <span className="text-sm font-semibold text-text-primary">
                  Volume
                </span>
                <NumberInput
                  value={volume}
                  min={0}
                  max={100}
                  // unit={item.unit}
                  onChange={(value) => handleVolumeChange(value)}
                  onCommit={(value) => handleVolumeChange(value)}
                />
              </div>
              <Slider
                min={0}
                max={100}
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sounds;
