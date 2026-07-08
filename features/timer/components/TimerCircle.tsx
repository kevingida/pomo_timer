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
  return (
    <div
      className="relative w-125 h-125 rounded-full my-6 backdrop-blur-lg bg-conic/decreasing from-[#F8F9FA] via-[#bfbfbf] to-[#1111] animate-spin-slow-reverse"
      style={{
        animationPlayState: isRunning ? "running" : "paused",
      }}
    >
      {/* Moon */}
      {/* Circle */}

      {/* <div
        className="relative w-125 h-125 rounded-full my-6  backdrop-blur-lg border border-border-primary flex items-center justify-center bg-conic/decreasing from-[#F8F9FA] via-[#bfbfbf] to-[#1111] animate-spin-slow-reverse"
        style={{ animationPlayState: isRunning ? "running" : "paused" }}
      > */}
      {/* Inner Circle */}
      <div className="absolute h-118 w-118 rounded-full bg-background" />

      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow flex flex-col justify-center items-center gap-14"
        style={{
          animationPlayState: isRunning ? "running" : "paused",
        }}
      >
        <div className="relative text-9xl font-semibold leading-none text-ink">
          {formatTime(remaining)}
        </div>
        {children}
      </div>
    </div>
  );
};

export default TimerCircle;
