import { useEffect, useMemo, useState } from "react";

export type TimerStatus = "idle" | "running" | "paused";

interface UseTimerProps {
  duration: number;
}

const useTimer = ({ duration }: UseTimerProps) => {
  const [elapsed, setElapsed] = useState<number>(0);
  const [status, setStatus] = useState<TimerStatus>("idle");

  const remaining = useMemo(
    () => Math.max(duration * 60 - elapsed, 0),
    [duration, elapsed],
  );

  const start = () => setStatus("running");
  const pause = () => setStatus("paused");
  const reset = () => {
    setElapsed(0);
    setStatus("idle");
  };

  // tick
  useEffect(() => {
    if (status !== "running") return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    stop();
  }, [duration]);

  return {
    elapsed,
    status,
    remaining,
    start,
    pause,
    reset,
  };
};

export default useTimer;
