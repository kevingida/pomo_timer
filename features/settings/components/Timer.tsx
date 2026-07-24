import Slider from "@/components/Slider";
import { CirclePlay, Clock, Minus, Plus, Repeat } from "lucide-react";
import useSettings from "../hooks/useSettings";
import { TIMER_SETTINGS } from "../constant";
import { useState } from "react";
import { SettingKey, TimerSetting } from "../type";
import Button from "@/components/Button";
import NumberInput from "@/components/NumberInput";
import Switch from "@/components/Switch";

type LocalTimerValues = {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
};

const Timer = () => {
  const { settings, updateSettings } = useSettings();
  const [localValues, setLocalValues] = useState<LocalTimerValues>({
    focusDuration: settings.focusDuration,
    shortBreakDuration: settings.shortBreakDuration,
    longBreakDuration: settings.longBreakDuration,
    longBreakInterval: settings.longBreakInterval,
    autoStartBreaks: settings.autoStartBreaks,
    autoStartPomodoros: settings.autoStartPomodoros,
  });

  // const commit = (raw: string, item: TimerSetting) => {
  //   const value =
  //     raw === ""
  //       ? item.min
  //       : Math.min(Math.max(Number(raw), item.min), item.max);
  //   updateSettings({ [item.settings]: value });
  //   setLocalValues((prev) => ({
  //     ...prev,
  //     [item.settings]: value,
  //   }));
  // };

  // const commitLongBreakInterval = (raw: string) => {
  //   const value = raw === "" ? 1 : Math.min(Math.max(Number(raw), 1), 10);
  //   updateSettings({ longBreakInterval: value });
  //   setLocalValues((prev) => ({
  //     ...prev,
  //     longBreakInterval: value,
  //   }));
  // };

  const updateLocalValue = (key: SettingKey, value: number | boolean) => {
    setLocalValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const commit = (
    key: SettingKey,
    value: number | boolean,
    min: number = 0,
    max: number = 100,
  ) => {
    if (typeof value === "boolean") {
      updateSettings({ [key]: value });
      updateLocalValue(key, value);
      return;
    }
    const next = Math.min(Math.max(value, min), max);

    updateSettings({
      [key]: next,
    });

    updateLocalValue(key, next);
  };

  return (
    <div>
      <h2 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5" /> Timer Settings
      </h2>
      <div className="flex flex-col gap-8 w-full">
        {TIMER_SETTINGS.map((item, index) => (
          <div key={index} className="flex flex-col w-full">
            <div className="flex flex-row gap-4 mt-2 justify-center items-center">
              <div className="flex w-fit h-fit p-2 rounded-full bg-white/5 items-center justify-center">
                <item.icon className="w-6 h-6 text-text-primary" />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <div className="flex flex-row gap-2 items-center justify-between w-full">
                  <span className="text-sm font-semibold text-text-primary">
                    {item.title}
                  </span>
                  <NumberInput
                    value={
                      localValues[
                        item.settings as keyof typeof localValues
                      ] as number
                    }
                    min={item.min}
                    max={item.max}
                    unit={item.unit}
                    onChange={(value) => updateLocalValue(item.settings, value)}
                    onCommit={(value) =>
                      commit(item.settings, value, item.min, item.max)
                    }
                  />
                </div>
                <Slider
                  min={item.min}
                  max={item.max}
                  value={
                    localValues[
                      item.settings as keyof typeof localValues
                    ] as number
                  }
                  onChange={(value) =>
                    commit(item.settings, value, item.min, item.max)
                  }
                />
              </div>
            </div>
          </div>
        ))}
        <div className="h-px bg-surface-active/40 rounded-full mt-4" />

        <div className="flex flex-row justify-between gap-4 mt-2 w-full items-center">
          <div className="flex flex-row gap-4 items-center">
            <div className="flex w-fit h-fit p-2 rounded-full bg-white/5 items-center justify-center">
              <Repeat className="w-6 h-6 text-text-primary" />
            </div>
            <label
              className="text-sm font-semibold text-text-primary"
              htmlFor="longBreakInterval"
            >
              Session before long break
            </label>
          </div>
          <div className="flex flex-row items-center border border-border-primary rounded-sm">
            <Button
              className=" rounded-sm p-1! -m-px"
              onClick={() =>
                commit(
                  "longBreakInterval",
                  Number((localValues.longBreakInterval - 1).toString()),
                  1,
                  10,
                )
              }
              size="sm"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <NumberInput
              value={
                localValues[
                  "longBreakInterval" as keyof typeof localValues
                ] as number
              }
              min={1}
              max={10}
              onCommit={(value) => commit("longBreakInterval", value, 1, 10)}
            />
            <Button
              className=" rounded-sm p-1! -m-px"
              onClick={() =>
                commit(
                  "longBreakInterval",
                  Number((localValues.longBreakInterval + 1).toString()),
                  1,
                  10,
                )
              }
              size="sm"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="h-px bg-surface-active/40 rounded-full mt-4" />

        <div className="flex flex-row justify-between gap-4 mt-2 w-full items-center">
          <div className="flex flex-row gap-4 items-center">
            <div className="flex w-fit h-fit p-2 rounded-full bg-white/5 items-center justify-center">
              <CirclePlay className="w-6 h-6 text-text-primary" />
            </div>
            <label
              className="text-sm font-semibold text-text-primary"
              htmlFor="autoStartPomodoros"
            >
              Start focus automatically
            </label>
          </div>
          <Switch
            checked={localValues.autoStartPomodoros}
            onChange={(checked) => commit("autoStartPomodoros", checked)}
            id="autoStartPomodoros"
          />
        </div>

        <div className="flex flex-row justify-between gap-4 mt-2 w-full items-center">
          <div className="flex flex-row gap-4 items-center">
            <div className="flex w-fit h-fit p-2 rounded-full bg-white/5 items-center justify-center">
              <CirclePlay className="w-6 h-6 text-text-primary" />
            </div>
            <label
              className="text-sm font-semibold text-text-primary"
              htmlFor="autoStartBreaks"
            >
              Start break automatically
            </label>
          </div>
          <Switch
            checked={localValues.autoStartBreaks}
            onChange={(checked) => commit("autoStartBreaks", checked)}
            id="autoStartBreaks"
          />
        </div>
      </div>
    </div>
  );
};

export default Timer;
