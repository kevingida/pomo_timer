"use client";

import ConfirmDialog from "@/components/ConfirmDialog";
import { formatTime } from "@/utils/formatTime";
import { useState } from "react";
import useDocumentTitle from "./hooks/useDocumentTitle";
import useTimer from "./hooks/useTimer";
import { Mode } from "./type";
import { MODES } from "./constant";
import TimerTabs from "./components/TimerTabs";
import TimerControl from "./components/TimerControl";
import TimerCircle from "./components/TimerCircle";
import useDialog from "./hooks/useDialog";
import useTimerActions from "./hooks/useTimerActions";

const Timer = () => {
  const [mode, setMode] = useState<Mode>("focus");

  const { remaining, status, start, pause, reset } = useTimer({
    duration: MODES[mode].duration,
  });

  const isRunning = status === "running";

  const { dialog, openDialog, closeDialog } = useDialog();

  const { showReset, handleReset, handlePlayPause, handleModeChange } =
    useTimerActions({
      setMode,
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

  return (
    <div className="flex flex-col items-center gap-4 rounded w-full">
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
