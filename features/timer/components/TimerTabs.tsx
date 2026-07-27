import Button from "@/components/Button";
import { MODES } from "../constant";
import { Mode } from "../type";
import useScreenSize from "@/hooks/useScreenSize";

interface TimerTabsProps {
  mode: Mode;
  handleModeChange: (newMode: Mode) => void;
}

const TimerTabs = ({ mode, handleModeChange }: TimerTabsProps) => {
  const { sm } = useScreenSize();
  return (
    <div className="flex gap-2 w-[90%] lg:w-1/2 border border-border-primary rounded-full">
      {Object.entries(MODES).map(([key, tab]) => (
        <Button
          key={key}
          onClick={() => handleModeChange(key as Mode)}
          variant={"primary"}
          active={mode === key}
          size={sm ? "lg" : "sm"}
          className="flex-1 text-nowrap"
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
};

export default TimerTabs;
