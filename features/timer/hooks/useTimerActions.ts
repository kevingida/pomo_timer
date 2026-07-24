import { Mode } from "../type";
import { ALERTS } from "../constant";
import { useCallback, useState } from "react";

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

  const resetTimer = useCallback(() => {
    reset();
    setShowReset(false);
  }, [reset]);

  const handleReset = useCallback(() => {
    if (!isIdle) {
      openDialog(ALERTS.reset.title, ALERTS.reset.description, resetTimer);
      return;
    }
    resetTimer();
  }, [isIdle, openDialog, resetTimer]);

  const handlePlayPause = useCallback(() => {
    setShowReset(true);
    if (isRunning) {
      openDialog(ALERTS.pause.title, ALERTS.pause.description, pause);
    } else {
      start();
    }
  }, [isRunning, openDialog, pause, start]);

  const handleChangeMode = useCallback(
    (newMode: Mode) => {
      resetTimer();
      changeMode(newMode);
    },
    [resetTimer, changeMode],
  );

  const handleModeChange = useCallback(
    (newMode: Mode) => {
      if (status !== "idle") {
        openDialog(ALERTS.stop.title, ALERTS.stop.description, () =>
          handleChangeMode(newMode),
        );
        return;
      }
      changeMode(newMode);
    },
    [status, openDialog, handleChangeMode, changeMode],
  );

  return {
    showReset,
    handleReset,
    handlePlayPause,
    handleModeChange,
  };
};

export default useTimerActions;
