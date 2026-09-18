import Button from "@/components/Button";
import { MODES } from "../constant";
import { Mode } from "../type";

interface TimerTabsProps {
  mode: Mode;
  handleModeChange: (newMode: Mode) => void;
}

const TimerTabs = ({ mode, handleModeChange }: TimerTabsProps) => {
  return (
    <div
      role="tablist"
      aria-label="Timer mode"
      className="flex gap-2 w-[90%] lg:w-1/2 border border-border-primary rounded-full"
    >
      {Object.entries(MODES).map(([key, tab]) => (
        <Button
          key={key}
          role="tab"
          aria-selected={mode === key}
          onClick={() => handleModeChange(key as Mode)}
          variant={"primary"}
          active={mode === key}
          size="responsive"
          className="flex-1 text-nowrap"
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
};

export default TimerTabs;
