import { Clock, Coffee, Sofa } from "lucide-react";
import { TimerSetting } from "./type";

export const TIMER_SETTINGS: TimerSetting[] = [
  {
    title: "Focus",
    settings: "focusDuration",
    icon: Clock,
    min: 5,
    max: 120,
    unit: "min",
    onChange: () => {},
  },
  {
    title: "Short Break",
    settings: "shortBreakDuration",
    icon: Coffee,
    min: 1,
    max: 30,
    unit: "min",
    onChange: () => {},
  },
  {
    title: "Long Break",
    settings: "longBreakDuration",
    icon: Sofa,
    min: 1,
    max: 60,
    unit: "min",
    onChange: () => {},
  },
];
