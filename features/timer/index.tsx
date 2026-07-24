"use client";

import ConfirmDialog from "@/components/ConfirmDialog";
import { formatTime } from "@/utils/formatTime";
import { useEffect, useRef } from "react";
import useDocumentTitle from "./hooks/useDocumentTitle";
import useTimer from "./hooks/useTimer";
import TimerTabs from "./components/TimerTabs";
import TimerControl from "./components/TimerControl";
import TimerCircle from "./components/TimerCircle";
import useDialog from "./hooks/useDialog";
import useTimerActions from "./hooks/useTimerActions";
import useSound from "./hooks/useSound";
import usePomodoroCycle from "./hooks/usePomodoroCycle";
import useTasks from "../task/hooks/useTasks";
import useSettings from "../settings/hooks/useSettings";

interface TimerProps {
  isDropdownOpen: boolean;
}

const Timer = ({ isDropdownOpen }: TimerProps) => {
  const { settings } = useSettings();

  const { mode, nextMode, changeMode } = usePomodoroCycle(
    settings.longBreakInterval,
  );

  const { remaining, status, isComplete, start, pause, reset } = useTimer({
    duration:
      mode === "focus"
        ? settings.focusDuration
        : mode === "shortBreak"
          ? settings.shortBreakDuration
          : settings.longBreakDuration,
  });

  const isRunning = status === "running";

  const { activeTaskId, incrementCompletedPomodoros } = useTasks();

  const { dialog, openDialog, closeDialog } = useDialog();

  const { playChime } = useSound(settings.soundEnabled);

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

  const modeRef = useRef(mode);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    if (!isComplete) return;

    const currentMode = modeRef.current;

    if (currentMode === "focus" && activeTaskId) {
      incrementCompletedPomodoros(activeTaskId);
    }

    const shouldAutoStart =
      (currentMode === "focus" && settings.autoStartBreaks) ||
      (currentMode !== "focus" && settings.autoStartPomodoros);

    nextMode();
    playChime();
    handleReset();

    if (shouldAutoStart) {
      setTimeout(() => {
        start();
      }, 1000);
    }
  }, [isComplete]);

  return (
    <div
      className={`relative h-screen z-0 flex flex-col items-center justify-center gap-4 rounded w-full p-4 transition-transform duration-300 ease-in-out ${isDropdownOpen ? "-translate-x-32" : "translate-x-0"}`}
    >
      <TimerTabs mode={mode} handleModeChange={handleModeChange} />

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
