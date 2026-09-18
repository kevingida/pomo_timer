import { Bell, Coffee, Sofa } from "lucide-react";
import { TimerSetting } from "./type";

export const SETTING_LIMITS = {
  focusDuration: { min: 5, max: 120 },
  shortBreakDuration: { min: 1, max: 30 },
  longBreakDuration: { min: 1, max: 60 },
  longBreakInterval: { min: 1, max: 10 },
} as const;

export const TIMER_SETTINGS: TimerSetting[] = [
  {
    title: "Focus",
    settings: "focusDuration",
    icon: Bell,
    ...SETTING_LIMITS.focusDuration,
    unit: "min",
  },
  {
    title: "Short Break",
    settings: "shortBreakDuration",
    icon: Coffee,
    ...SETTING_LIMITS.shortBreakDuration,
    unit: "min",
  },
  {
    title: "Long Break",
    settings: "longBreakDuration",
    icon: Sofa,
    ...SETTING_LIMITS.longBreakDuration,
    unit: "min",
  },
];
