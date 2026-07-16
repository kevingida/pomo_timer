import Button from "@/components/Button";
import { Task } from "@/features/task/type";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TaskFormProps {
  selectedTask: Task;
  handleInputChange: (
    field: keyof Task,
    event?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    value?: number,
  ) => void;
  resizeTextarea: (element: HTMLTextAreaElement | null) => void;
}

const TaskForm = ({
  selectedTask,
  handleInputChange,
  resizeTextarea,
}: TaskFormProps) => {
  return (
    <div className="flex flex-col gap-4">
      <textarea
        ref={resizeTextarea}
        onChange={(e) => handleInputChange("title", e)}
        placeholder="New task ..."
        className="text-md font-semibold text-text-primary bg-transparent border-none focus:outline-none wrap-break-word w-65 resize-none"
        value={selectedTask?.title || ""}
      />
      <div className="flex flex-row items-center justify-between gap-2">
        <label
          htmlFor="estimatedPomodoros"
          className="text-base font-normal text-text-primary flex-1 w-full"
        >
          Estimated Pomodoros:
        </label>
        <span className="flex flex-row items-center justify-center">
          <Button
            className="border-none p-0!"
            onClick={() =>
              handleInputChange(
                "estimatedPomodoros",
                undefined,
                Math.max(0, selectedTask.estimatedPomodoros - 1),
              )
            }
            size="sm"
          >
            <ChevronLeft />
          </Button>
          <input
            id="estimatedPomodoros"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-10 text-center bg-transparent text-base"
            value={selectedTask?.estimatedPomodoros}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
              const value = raw === "" ? 0 : Math.min(Number(raw), 99);
              handleInputChange("estimatedPomodoros", undefined, value);
            }}
          />
          <Button
            className="border-none p-0!"
            onClick={() =>
              handleInputChange(
                "estimatedPomodoros",
                undefined,
                Math.max(0, selectedTask.estimatedPomodoros + 1),
              )
            }
            size="sm"
          >
            <ChevronRight />
          </Button>
        </span>
      </div>
      <textarea
        ref={resizeTextarea}
        onChange={(e) => handleInputChange("notes", e)}
        placeholder="Add notes ..."
        className="text-sm font-normal text-text-primary bg-transparent border-none focus:outline-none wrap-break-word w-65 resize-none"
        value={selectedTask?.notes || ""}
      />
    </div>
  );
};

export default TaskForm;
