import { Brush } from "lucide-react";
import React from "react";

const Themes = () => {
  return (
    <div>
      <h2 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-4">
        <Brush className="w-5 h-5" /> Theme Settings
      </h2>
      {/* <div className="flex flex-col gap-6 w-full">
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
                  <span className="text-sm font-semibold text-text-primary">
                    <input
                      id={item.settings}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="w-10 text-center bg-transparent focus:outline-none focus:ring-2 focus:ring-surface-active border-none hover:cursor-pointer
                      [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      value={
                        localValues[
                          item.settings as keyof typeof localValues
                        ] as number
                      }
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        setLocalValues((prev) => ({
                          ...prev,
                          [item.settings]: raw === "" ? "" : Number(raw),
                        }));
                      }}
                      onBlur={(e) => {
                        commit(e.target.value, item);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          (e.target as HTMLInputElement).blur();
                      }}
                    />
                    {item.unit}
                  </span>
                </div>
                <Slider
                  min={item.min}
                  max={item.max}
                  value={settings[item.settings] as number}
                  onChange={(value) =>
                    updateSettings({ [item.settings]: value })
                  }
                />
              </div>
            </div>
            <div className="h-px bg-surface-active/40 rounded-full mt-6" />
          </div>
        ))}
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
                updateSettings({
                  focusDuration: Math.max(0, settings.focusDuration - 1),
                })
              }
              size="sm"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <input
              id="longBreakInterval"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-10 text-sm font-semibold text-text-primary text-center bg-transparent focus:outline-none focus:ring-2 focus:ring-surface-active border-none hover:cursor-pointer
                      [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              value={
                localValues[
                  "longBreakInterval" as keyof typeof localValues
                ] as number
              }
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "");
                setLocalValues((prev) => ({
                  ...prev,
                  ["longBreakInterval"]: raw === "" ? "" : Number(raw),
                }));
              }}
              onBlur={(e) => {
                commitLongBreakInterval(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
            />
            <Button
              className=" rounded-sm p-1! -m-px"
              onClick={() =>
                updateSettings({
                  focusDuration: Math.max(0, settings.focusDuration + 1),
                })
              }
              size="sm"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Themes;
