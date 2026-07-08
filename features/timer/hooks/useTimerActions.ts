import { Mode } from "../type";
import { ALERTS } from "../constant";
import { useState } from "react";

type useTimerActionsProps = {
  setMode: (mode: Mode) => void;
  status: string;
  start: () => void;
  pause: () => void;
  reset: () => void;
  openDialog: (title: string, description: string, confirm: () => void) => void;
};
const useTimerActions = ({
  setMode,
  status,
  start,
  pause,
  reset,
  openDialog,
}: useTimerActionsProps) => {
  const [showReset, setShowReset] = useState<boolean>(false);

  const isRunning = status === "running";

  const resetTimer = () => {
    reset();
    setShowReset(false);
  };

  const handleReset = () => {
    openDialog(ALERTS.reset.title, ALERTS.reset.description, resetTimer);
  };

  const handlePlayPause = () => {
    setShowReset(true);
    if (isRunning) {
      openDialog(ALERTS.pause.title, ALERTS.pause.description, pause);
    } else {
      start();
    }
  };

  const changeMode = (newMode: Mode) => {
    resetTimer();
    setMode(newMode);
  };

  const handleModeChange = (newMode: Mode) => {
    if (status !== "idle") {
      openDialog(ALERTS.stop.title, ALERTS.stop.description, () =>
        changeMode(newMode),
      );
      return;
    }
    setMode(newMode);
  };
  return {
    showReset,
    handleReset,
    handlePlayPause,
    handleModeChange,
  };
};

export default useTimerActions;
