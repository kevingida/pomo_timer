"use client";

import ConfirmDialog from "@/components/ConfirmDialog";
import { formatTime } from "@/utils/formatTime";
import { useEffect } from "react";
import useDocumentTitle from "./hooks/useDocumentTitle";
import useTimer from "./hooks/useTimer";
import { MODES } from "./constant";
import TimerTabs from "./components/TimerTabs";
import TimerControl from "./components/TimerControl";
import TimerCircle from "./components/TimerCircle";
import useDialog from "./hooks/useDialog";
import useTimerActions from "./hooks/useTimerActions";
import useSound from "./hooks/useSound";
import usePomodoroCycle from "./hooks/usePomodoroCycle";

const Timer = ({ isTaskOpen }: { isTaskOpen: boolean }) => {
  const { mode, nextMode, resetCycle, changeMode } = usePomodoroCycle();

  const { remaining, status, isComplete, start, pause, reset } = useTimer({
    duration: MODES[mode].duration,
  });

  const isRunning = status === "running";

  const { dialog, openDialog, closeDialog } = useDialog();

  const { playChime } = useSound(true);

  const { showReset, handleReset, handlePlayPause, handleModeChange } =
    useTimerActions({
      changeMode,
      status,
      start,
      pause,
      reset,
      openDialog,
    });

  //update document title
  useDocumentTitle({
    remaining,
    status,
  });

  useEffect(() => {
    if (!isComplete) return;
    setTimeout(() => {
      start();
    }, 1000);
    playChime(false);
    nextMode();
    handleReset();
  }, [isComplete, playChime, nextMode, handleReset]);

  return (
    <div
      className={`relative z-0 flex flex-col items-center gap-4 rounded w-full p-4 transition-transform duration-300 ease-in-out ${isTaskOpen ? "-translate-x-32" : "translate-x-0"}`}
    >
      <TimerTabs
        mode={mode}
        status={status}
        handleModeChange={handleModeChange}
      />

      <TimerCircle
        isRunning={isRunning}
        remaining={remaining}
        formatTime={formatTime}
      >
        <TimerControl
          isRunning={isRunning}
          showReset={showReset}
          handleReset={handleReset}
          handlePlayPause={handlePlayPause}
        />
      </TimerCircle>

      <ConfirmDialog
        open={dialog.open}
        title={dialog.title}
        description={dialog.description}
        onConfirm={dialog.onConfirm}
        onCancel={closeDialog}
      />
    </div>
  );
};

export default Timer;
