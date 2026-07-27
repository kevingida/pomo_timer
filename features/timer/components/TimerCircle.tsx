import useTasks from "@/features/task/hooks/useTasks";
import useScreenSize from "@/hooks/useScreenSize";

interface TimerCircleProps {
  isRunning: boolean;
  remaining: number;
  formatTime: (time: number) => string;
  children?: React.ReactNode;
}

const TimerCircle = ({
  isRunning,
  remaining,
  formatTime,
  children,
}: TimerCircleProps) => {
  const { activeTask } = useTasks();
  const { sm } = useScreenSize();

  return (
    <div className="relative w-80 h-80 lg:w-125 lg:h-125 rounded-full my-6">
      {/* Moon shaped outer circle*/}
      <div
        className="absolute inset-0 rounded-full bg-conic-270 from-gradient-primary via-gradient-secondary to-gradient-tertiary animate-spin-slow-reverse"
        style={{
          animationPlayState: isRunning ? "running" : "paused",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 14px), #000 calc(100% - 14px))",
          mask: "radial-gradient(farthest-side  at 45% 50%, transparent calc(100% - 34px), #000 calc(100% - 7px))",
        }}
      />
      {/* Circle shaped outer circle*/}

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  flex flex-col justify-center items-center gap-2 lg:gap-14">
        <div className="text-8xl lg:text-9xl font-semibold leading-none text-text-primary flex flex-col items-center justify-center gap-2 tracking-wide [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]">
          {activeTask?.title && (
            <span className="text-base lg:text-lg max-w-90 font-semibold lg:font-bold leading-none text-nowrap truncate tracking-wide px-4 py-1.5 rounded-full bg-black/35 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.35)] ">
              {activeTask.title}
            </span>
          )}
          {formatTime(remaining)}
        </div>
        {children}
      </div>
    </div>
  );
};

export default TimerCircle;
