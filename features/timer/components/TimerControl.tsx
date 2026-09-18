import Button from "@/components/Button";
import Tooltip from "@/components/Tooltip";
import useScreenSize from "@/hooks/useScreenSize";
import { RotateCcw, Pause, Play, PictureInPicture } from "lucide-react";

interface TimerControlProps {
  isRunning: boolean;
  showReset: boolean;
  handlePlayPause: () => void;
  handleReset: () => void;
  onPiPClick?: () => void;
  isPiPSupported?: boolean;
  isPiPActive?: boolean;
  hidePIPButton?: boolean;
}

const TimerControl = ({
  isRunning,
  showReset,
  handlePlayPause,
  handleReset,
  onPiPClick,
  isPiPSupported = false,
  isPiPActive = false,
  hidePIPButton = false,
}: TimerControlProps) => {
  const { sm } = useScreenSize();

  const gridCols = isPiPSupported ? "grid-cols-3" : "grid-cols-2";
  const gridWidth = isPiPSupported ? "lg:w-full" : "lg:w-62.5";

  return (
    <div
      className={`relative grid ${gridCols} ${gridWidth} gap-4 place-items-center lg:gap-12`}
    >
      <Tooltip content="Reset">
        <Button
          data-action="reset"
          size="circle"
          onClick={handleReset}
          className={`transition-opacity duration-200 h-13.5 aspect-square flex items-center justify-center ${showReset ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <RotateCcw className="lg:w-6 lg:h-6 w-5 h-5" />
        </Button>
      </Tooltip>

      <Button
        data-action="play-pause"
        onClick={handlePlayPause}
        size={sm ? "lg" : "sm"}
        className="min-h-13.5 shrink-0"
      >
        {isRunning ? (
          <div className="flex items-center gap-2">
            <Pause /> Pause
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Play /> Start
          </div>
        )}
      </Button>

      {isPiPSupported && !hidePIPButton && (
        <Tooltip content={isPiPActive ? "Exit PiP" : "Picture in Picture"}>
          <Button
            size="circle"
            onClick={onPiPClick}
            className={`h-13.5 aspect-square flex items-center justify-center transition-all p-0 ${
              isPiPActive ? "" : "bg-surface-active/70"
            }`}
          >
            <PictureInPicture className="lg:w-6 lg:h-6 w-5 h-5" />
          </Button>
        </Tooltip>
      )}
    </div>
  );
};

export default TimerControl;
