import { useCallback, useEffect, useRef, useState } from "react";
import { Mode } from "../type";

const usePomodoroCycle = (longBreakInterval: number) => {
  const [mode, setMode] = useState<Mode>("focus");
  const [completedFocus, setCompletedFocus] = useState(0);

  const modeRef = useRef(mode);
  const completedFocusRef = useRef(completedFocus);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    completedFocusRef.current = completedFocus;
  }, [completedFocus]);

  const nextMode = useCallback(() => {
    if (modeRef.current === "focus") {
      const completed = completedFocusRef.current + 1;
      setCompletedFocus(completed);
      setMode(completed % longBreakInterval === 0 ? "longBreak" : "shortBreak");
      return;
    }
    setMode("focus");
  }, [longBreakInterval]);

  const resetCycle = useCallback(() => {
    setMode("focus");
    setCompletedFocus(0);
  }, []);

  const changeMode = useCallback((newMode: Mode) => {
    setMode(newMode);
  }, []);

  return {
    mode,
    completedFocus,
    nextMode,
    resetCycle,
    changeMode,
  };
};

export default usePomodoroCycle;
