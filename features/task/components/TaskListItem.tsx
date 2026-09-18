import { useRef, useState } from "react";
import { EditorType, Task } from "../type";
import Button from "@/components/Button";
import { useSortable } from "@dnd-kit/react/sortable";
import { GripVertical, CircleCheckBig, Circle } from "lucide-react";
import Tooltip from "@/components/Tooltip";

interface TaskListItemProps {
  task: Task;
  index: number;
  handleOpenTask: (editorType: EditorType, task?: Task) => void;
  handleCompleteTask: (taskId: string) => void;
}

const TaskListItem = ({
  task,
  index,
  handleOpenTask,
  handleCompleteTask,
}: TaskListItemProps) => {
  const [element, setElement] = useState<Element | null>(null);

  const handleRef = useRef<HTMLButtonElement | null>(null);

  const { isDragging } = useSortable({
    id: task.id,
    index,
    element,
    handle: handleRef,
  });
  return (
    <li
      ref={setElement}
      className={`flex flex-row items-center justify-between gap-2 p-2 rounded-lg border border-border-primary hover:border-surface-active hover:bg-surface-primary/50 transition-all duration-200 ${isDragging ? "item-shadow" : ""}`}
    >
      <button
        ref={handleRef}
        type="button"
        aria-label="Drag to reorder"
        className="cursor-grab text-text-primary touch-none"
      >
        <GripVertical />
      </button>

      <button
        type="button"
        onClick={() => handleOpenTask("TaskDetails", task)}
        className="flex flex-1 min-w-0 flex-row items-center justify-between gap-2 text-left text-text-primary cursor-pointer"
      >
        <span
          className={`truncate ${task.completed ? "line-through text-text-primary/50" : ""}`}
        >
          {task.title}
        </span>
        <span className="text-text-primary/50 shrink-0">
          {task.completedPomodoros}/{task.estimatedPomodoros}
        </span>
      </button>

      <Button
        className="border-none p-0!"
        aria-label={
          task.completed ? "Mark as not completed" : "Mark as completed"
        }
        aria-pressed={task.completed}
        onClick={() => handleCompleteTask(task.id)}
      >
        <Tooltip content={task.completed ? "Completed" : "Not completed"}>
          {task.completed ? (
            <CircleCheckBig className="text-success" />
          ) : (
            <Circle className="text-error" />
          )}
        </Tooltip>
      </Button>
    </li>
  );
};

export default TaskListItem;
