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

  const handleRef = useRef<SVGSVGElement | null>(null);

  const { isDragging } = useSortable({
    id: task.id,
    index,
    element,
    handle: handleRef,
  });
  return (
    <li
      ref={setElement}
      key={task.id}
      className={`flex flex-row items-center justify-between p-2 rounded-lg border border-border-primary cursor-pointer hover:border-surface-active hover:bg-surface-primary/50 transition-all duration-200 ${isDragging ? "item-shadow" : ""}`}
      onClick={() => handleOpenTask("TaskDetails", task)}
    >
      <div className="flex flex-row items-center gap-2 text-text-primary w-full">
        <GripVertical ref={handleRef} />
        <span
          className={`max-w-62.5 truncate ${task.completed && "line-through text-text-primary/50"}`}
        >
          {task.title}
        </span>
      </div>
      <div className="text-text-primary/50 mr-2">
        {task.completedPomodoros}/{task.estimatedPomodoros}
      </div>

      <Button
        className="border-none p-0!"
        onClick={(e) => {
          e.stopPropagation();
          handleCompleteTask(task.id);
        }}
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
