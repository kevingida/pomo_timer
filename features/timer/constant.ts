import { Mode } from "./type";

export const ALERTS = {
  reset: {
    title: "Reset timer?",
    description:
      "Your current session will be reset and any progress will be lost.",
  },

  pause: {
    title: "Pause timer?",
    description: "This will pause the timer and you can resume it later.",
  },

  stop: {
    title: "Stop current session?",
    description: "Stopping will end the current Pomodoro session.",
  },
};

export const MODES: Record<
  Mode,
  {
    label: string;
    duration: number;
  }
> = {
  focus: {
    label: "Focus",
    duration: 0.2,
  },
  shortBreak: {
    label: "Short Break",
    duration: 0.1,
  },
  longBreak: {
    label: "Long Break",
    duration: 0.1,
  },
  leisure: {
    label: "Leisure",
    duration: 1,
  },
};

export const CYCLE = {
  focus: "shortBreak",
  shortBreak: "focus",
  longBreak: "focus",
};
