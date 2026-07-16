import { formatTime } from "@/utils/formatTime";
import { useEffect } from "react";

type TimerStatus = "idle" | "running" | "paused";

interface UseDocumentTitleProps {
  remaining: number;
  status: TimerStatus;
}

const useDocumentTitle = ({ remaining, status }: UseDocumentTitleProps) => {
  useEffect(() => {
    const time = formatTime(remaining);

    switch (status) {
      case "running":
        document.title = `🍅 ${time} - Pomodoro Timer`;
        break;

      case "paused":
        document.title = `⏸ ${time} - Pomodoro Timer`;
        break;

      default:
        document.title = "Pomodoro Timer";
    }

    // Restore the title when the component unmounts
    return () => {
      document.title = "Pomodoro Timer";
    };
  }, [remaining, status]);
};

export default useDocumentTitle;
