import Button from "@/components/Button";
import { MODES } from "../constant";
import { Mode } from "../type";

interface TimerTabsProps {
  mode: Mode;
  status: string;
  // openDialog: (title: string, description: string, confirm: () => void) => void;
  handleModeChange: (newMode: Mode) => void;
}

const TimerTabs = ({
  mode,
  status,
  // openDialog,
  handleModeChange,
}: TimerTabsProps) => {
  return (
    <div className="flex gap-2 w-1/2 border border-border-primary rounded-full">
      {Object.entries(MODES).map(([key, tab]) => (
        <Button
          key={key}
          onClick={() => handleModeChange(key as Mode)}
          variant={"primary"}
          active={mode === key}
          size="lg"
          className="flex-1"
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
};

export default TimerTabs;
