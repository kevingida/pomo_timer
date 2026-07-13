import { move } from "@dnd-kit/helpers";
import { DragDropProvider } from "@dnd-kit/react";
import { EditorType, Task } from "../type";
import TaskListItem from "./TaskListItem";

interface TasksListProps {
  taskList: Task[];
  reorderTasks: (event: Parameters<typeof move>[1]) => void;
  handleOpenTask: (editorType: EditorType, task?: Task) => void;
  handleCompleteTask: (taskId: string) => void;
}

const TasksList = ({
  taskList,
  reorderTasks,
  handleOpenTask,
  handleCompleteTask,
}: TasksListProps) => {
  return (
    <DragDropProvider onDragEnd={reorderTasks}>
      <ul className="flex flex-col gap-2 overflow-visible scrollbar-thin scrollbar-thumb-surface-primary scrollbar-track-transparent">
        {taskList.map((task, index) => (
          <TaskListItem
            key={task.id}
            task={task}
            index={index}
            handleOpenTask={handleOpenTask}
            handleCompleteTask={handleCompleteTask}
          />
        ))}
      </ul>
    </DragDropProvider>
  );
};

export default TasksList;
