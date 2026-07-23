export type Settings = {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
};

export type TimerSetting = {
  title: string;
  settings: keyof Settings;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
};
