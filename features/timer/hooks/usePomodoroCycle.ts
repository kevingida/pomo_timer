import { useState } from "react";
import { Mode } from "../type";

const usePomodoroCycle = () => {
  const [mode, setMode] = useState<Mode>("focus");
  const [completedFocus, setCompletedFocus] = useState(0);

  const nextMode = () => {
    if (mode === "focus") {
      const completed = completedFocus + 1;

      setCompletedFocus(completed);

      if (completed % 4 === 0) {
        setMode("longBreak");
      } else {
        setMode("shortBreak");
      }

      return;
    }

    setMode("focus");
  };

  const resetCycle = () => {
    setMode("focus");
    setCompletedFocus(0);
  };

  const changeMode = (newMode: Mode) => {
    setMode(newMode);
  };

  return {
    mode,
    completedFocus,
    nextMode,
    resetCycle,
    changeMode,
  };
};

export default usePomodoroCycle;
