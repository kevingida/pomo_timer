export type TimerStatus = "idle" | "running" | "paused";

export type Mode = "focus" | "shortBreak" | "longBreak";

export type Partial = { freq: number; gain: number };

export type ToneOptions = {
  partials: Partial[];
  attack?: number;
  decay?: number;
  type?: OscillatorType;
  stagger?: number;
};
