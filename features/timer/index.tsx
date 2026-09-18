"use client";

import ConfirmDialog from "@/components/ConfirmDialog";
import { formatTime } from "@/utils/formatTime";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import useDocumentTitle from "./hooks/useDocumentTitle";
import useTimer from "./hooks/useTimer";
import TimerTabs from "./components/TimerTabs";
import TimerControl from "./components/TimerControl";
import TimerCircle from "./components/TimerCircle";
import useDialog from "./hooks/useDialog";
import useTimerActions from "./hooks/useTimerActions";
import useSound from "./hooks/useSound";
import usePomodoroCycle from "./hooks/usePomodoroCycle";
import { useDocumentPiP } from "./hooks/useDocumentPiP";
import { PiPProvider } from "./context/PiPContext";
import { useTheme } from "@/features/theme/hooks/useThemes";
import useTasks from "../task/hooks/useTasks";
import useSettings from "../settings/hooks/useSettings";
import useScreenSize from "@/hooks/useScreenSize";

interface TimerProps {
  isDropdownOpen: boolean;
}

const Timer = ({ isDropdownOpen }: TimerProps) => {
  const { settings } = useSettings();
  const { theme } = useTheme();

  const { lg } = useScreenSize();

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

  const { handlePlaySound } = useSound(settings.soundEnabled, settings.volume);

  const { showReset, handleReset, handlePlayPause, handleModeChange } =
    useTimerActions({
      changeMode,
      status,
      start,
      pause,
      reset,
      openDialog,
    });

  const {
    pipContainer,
    isPiPActive,
    isSupported: isPiPSupported,
    togglePiP,
  } = useDocumentPiP();

  //update document title
  useDocumentTitle({
    remaining,
    status,
  });

  const modeRef = useRef(mode);

  const handleSoundPlay = (mode: "focus" | "shortBreak" | "longBreak") => {
    if (!settings.soundEnabled) return;
    if (mode === "focus") {
      handlePlaySound(settings.focusEndSound);
    } else {
      handlePlaySound(settings.breakEndSound);
    }
  };

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
    handleSoundPlay(currentMode);
    handleReset();

    if (shouldAutoStart) {
      setTimeout(() => {
        start();
      }, 1000);
    }
  }, [isComplete]);

  const shouldShift = isDropdownOpen && lg;

  return (
    <PiPProvider pipContainer={pipContainer} isPiPActive={isPiPActive}>
      <div
        className={`relative min-h-screen flex flex-col items-center justify-center gap-4 rounded w-full p-4 overflow-hidden transition-transform duration-300 ease-in-out
      ${shouldShift ? "-translate-x-32" : "translate-x-0"}`}
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
            onPiPClick={togglePiP}
            isPiPSupported={isPiPSupported}
            isPiPActive={isPiPActive}
          />
        </TimerCircle>

        {/* Pin this copy to the main document even while PiP is open */}
        <PiPProvider pipContainer={null} isPiPActive={false}>
          <ConfirmDialog
            open={dialog.open}
            title={dialog.title}
            description={dialog.description}
            onConfirm={dialog.onConfirm}
            onCancel={closeDialog}
          />
        </PiPProvider>
      </div>

      {pipContainer &&
        createPortal(
          <div
            className="flex flex-col items-center justify-center gap-4 w-full h-full bg-center bg-cover bg-no-repeat"
            style={{
              background: theme.variables["--background"]
                ? theme.variables["--background"]
                : `url(${theme.wallpaper}) center / cover no-repeat`,
            }}
          >
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
                hidePIPButton
                isPiPSupported={isPiPSupported}
                isPiPActive={isPiPActive}
              />
            </TimerCircle>

            <ConfirmDialog
              open={dialog.open}
              title={dialog.title}
              description={dialog.description}
              onConfirm={dialog.onConfirm}
              onCancel={closeDialog}
            />
          </div>,
          pipContainer,
        )}
    </PiPProvider>
  );
};

export default Timer;
