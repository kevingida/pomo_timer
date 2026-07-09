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
    <div className="relative w-125 h-125 rounded-full my-6">
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

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  flex flex-col justify-center items-center gap-14">
        <div className="text-9xl font-semibold leading-none text-text-primary">
          {formatTime(remaining)}
        </div>
        {children}
      </div>
    </div>
  );
};

export default TimerCircle;
