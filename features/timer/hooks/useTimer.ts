import { useCallback, useEffect, useState } from "react";
import { TimerStatus } from "../type";

interface UseTimerProps {
  duration: number;
}

type TimerState = {
  status: TimerStatus;
  // Elapsed time accumulated before the current running segment
  baseElapsedMs: number;
  startedAt: number | null;
  elapsedMs: number;
};

const IDLE: TimerState = {
  status: "idle",
  baseElapsedMs: 0,
  startedAt: null,
  elapsedMs: 0,
};

// Elapsed time is derived from wall-clock timestamps rather than counted ticks, so the
// timer stays accurate when the tab is hidden and the browser throttles timers.
const useTimer = ({ duration }: UseTimerProps) => {
  const totalMs = duration * 60 * 1000;

  const [timer, setTimer] = useState<TimerState>(IDLE);
  const [prevDuration, setPrevDuration] = useState(duration);

  if (prevDuration !== duration) {
    setPrevDuration(duration);
    setTimer(IDLE);
  }

  const { status, baseElapsedMs, startedAt, elapsedMs } = timer;

  const remaining = Math.max(Math.ceil((totalMs - elapsedMs) / 1000), 0);
  const isComplete = elapsedMs >= totalMs;

  const start = useCallback(() => {
    const now = Date.now();
    setTimer((prev) =>
      prev.status === "running"
        ? prev
        : { ...prev, status: "running", startedAt: now },
    );
  }, []);

  const pause = useCallback(() => {
    const now = Date.now();
    setTimer((prev) => {
      if (prev.status !== "running" || prev.startedAt === null) return prev;
      const elapsed = prev.baseElapsedMs + (now - prev.startedAt);
      return {
        status: "paused",
        baseElapsedMs: elapsed,
        startedAt: null,
        elapsedMs: elapsed,
      };
    });
  }, []);

  const reset = useCallback(() => {
    setTimer(IDLE);
  }, []);

  useEffect(() => {
    if (status !== "running" || startedAt === null) return;

    const tick = () => {
      const elapsed = Math.min(baseElapsedMs + (Date.now() - startedAt), totalMs);
      setTimer((prev) =>
        elapsed >= totalMs
          ? {
              status: "idle",
              baseElapsedMs: totalMs,
              startedAt: null,
              elapsedMs: totalMs,
            }
          : { ...prev, elapsedMs: elapsed },
      );
    };

    const id = setInterval(tick, 1000);
    document.addEventListener("visibilitychange", tick);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [status, startedAt, baseElapsedMs, totalMs]);

  return {
    status,
    remaining,
    isComplete,
    start,
    pause,
    reset,
  };
};

export default useTimer;
