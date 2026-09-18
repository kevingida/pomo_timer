import React from "react";
import { Editor, Task } from "../../type";
import { Trash2, X } from "lucide-react";
import TaskForm from "./components/TaskForm";
import Button from "@/components/Button";

interface TaskEditorProps {
  selectedTask: Task;
  editor: Editor;
  closeEditor: () => void;
  handleInputChange: (
    field: keyof Task,
    event?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    value?: number,
  ) => void;
  handleAddTask: () => void;
  handleDeleteTask: () => void;
  resizeTextarea: (element: HTMLTextAreaElement | null) => void;
}

const TaskEditor = ({
  selectedTask,
  editor,
  closeEditor,
  handleInputChange,
  handleAddTask,
  handleDeleteTask,
  resizeTextarea,
}: TaskEditorProps) => {
  const isNewTask = editor.type === "newTask";
  return (
    <div
      className={`flex flex-col relative w-full rounded-lg overflow-hidden transition-all duration-500 ${
        editor.status
          ? "max-h-96 opacity-100 p-4 border border-border-primary mb-4"
          : "max-h-0 opacity-0 p-0 border-0 mb-0"
      }`}
      inert={!editor.status}
    >
      <button
        type="button"
        aria-label="Close editor"
        className="cursor-pointer absolute top-2 right-2"
        onClick={closeEditor}
      >
        <X />
      </button>
      <TaskForm
        selectedTask={selectedTask}
        handleInputChange={handleInputChange}
        resizeTextarea={resizeTextarea}
      />
      {isNewTask ? (
        <Button
          onClick={handleAddTask}
          className="self-end bg-surface-active! text-text-active! hover:bg-transparent! hover:text-text-primary! focus:ring-surface-active shadow-lg"
          size="sm"
        >
          Add Task
        </Button>
      ) : (
        <div className="flex flex-row gap-2 w-full justify-end">
          <Button
            onClick={handleDeleteTask}
            aria-label="Delete task"
            className="self-end bg-surface-active! text-text-active! hover:bg-transparent! hover:text-text-primary! focus:ring-surface-active shadow-lg w-20 flex flex-row items-center justify-center"
            size="sm"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskEditor;
