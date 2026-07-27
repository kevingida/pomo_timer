import Button from "@/components/Button";
import Tooltip from "@/components/Tooltip";
import useScreenSize from "@/hooks/useScreenSize";
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
  const { sm } = useScreenSize();
  return (
    <div className="relative grid grid-cols-3 lg:w-62.5 gap-12 place-items-center ">
      <Tooltip content="Reset">
        <Button
          size={sm ? "lg" : "sm"}
          onClick={handleReset}
          className={` transition-opacity duration-200 h-full aspect-square flex items-center justify-center ${showReset ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <RotateCcw className="lg:w-6 lg:h-6 w-5 h-5" />
        </Button>
      </Tooltip>

      <Button onClick={handlePlayPause} size={sm ? "lg" : "sm"}>
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
