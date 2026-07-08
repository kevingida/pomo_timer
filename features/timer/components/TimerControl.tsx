import Button from "@/components/Button";
import { RotateCcw, Pause, Play } from "lucide-react";

interface TimerControlProps {
  isRunning: boolean;
  showReset: boolean;
  handlePlayPause: () => void;
  handleReset: () => void;
}

const TimerControl = ({
  isRunning,
  showReset,
  handlePlayPause,
  handleReset,
}: TimerControlProps) => {
  return (
    <div className="relative grid grid-cols-3 w-62.5 gap-12 place-items-center ">
      <Button
        tooltip="Reset"
        onClick={handleReset}
        className={` transition-opacity duration-200 h-full aspect-square flex items-center justify-center ${showReset ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <RotateCcw />
      </Button>

      <Button onClick={handlePlayPause} size="lg">
        {isRunning ? (
          <p className="flex items-center gap-2">
            <Pause /> Pause
          </p>
        ) : (
          <p className="flex items-center gap-2">
            <Play /> Start
          </p>
        )}
      </Button>
    </div>
  );
};

export default TimerControl;
