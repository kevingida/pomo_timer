import { Mode } from "../type";
import { ALERTS } from "../constant";
import { useState } from "react";

type useTimerActionsProps = {
  changeMode: (mode: Mode) => void;
  status: string;
  start: () => void;
  pause: () => void;
  reset: () => void;
  openDialog: (title: string, description: string, confirm: () => void) => void;
};
const useTimerActions = ({
  changeMode,
  status,
  start,
  pause,
  reset,
  openDialog,
}: useTimerActionsProps) => {
  const [showReset, setShowReset] = useState<boolean>(false);

  const isRunning = status === "running";
  const isIdle = status === "idle";

  const resetTimer = () => {
    reset();
    setShowReset(false);
  };

  const handleReset = () => {
    if (!isIdle) {
      openDialog(ALERTS.reset.title, ALERTS.reset.description, resetTimer);
      return;
    }
    resetTimer();
  };

  const handlePlayPause = () => {
    setShowReset(true);
    if (isRunning) {
      openDialog(ALERTS.pause.title, ALERTS.pause.description, pause);
    } else {
      start();
    }
  };

  const handleChangeMode = (newMode: Mode) => {
    resetTimer();
    changeMode(newMode);
  };

  const handleModeChange = (newMode: Mode) => {
    if (status !== "idle") {
      openDialog(ALERTS.stop.title, ALERTS.stop.description, () =>
        handleChangeMode(newMode),
      );
      return;
    }
    changeMode(newMode);
  };
  return {
    showReset,
    handleReset,
    handlePlayPause,
    handleModeChange,
  };
};

export default useTimerActions;
