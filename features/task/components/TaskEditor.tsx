import Button from "@/components/Button";
import { X, Trash2 } from "lucide-react";
import { Editor, Task } from "../type";

interface TaskEditorProps {
  selectedTask: Task | null;
  editor: Editor;
  closeEditor: () => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: "title" | "notes",
  ) => void;
  handleAddTask: () => void;
  handleUpdateTask: () => void;
  handleDeleteTask: () => void;
  resizeTextarea: (element: HTMLTextAreaElement | null) => void;
}

const TaskEditor = ({
  selectedTask,
  editor,
  closeEditor,
  handleInputChange,
  handleAddTask,
  handleUpdateTask,
  handleDeleteTask,
  resizeTextarea,
}: TaskEditorProps) => {
  return (
    <div
      className={`relative w-full rounded-lg border border-border-primary overflow-hidden transition-all duration-500 ${
        editor.status ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <X
        className="cursor-pointer absolute top-2 right-2"
        onClick={closeEditor}
      />
      {/* Add Task Form */}
      <div
        className={`flex flex-col gap-2 p-4 transition-all duration-500 ${editor.type === "newTask" ? "opacity-100" : "hidden opacity-0"}`}
      >
        <textarea
          ref={resizeTextarea}
          onChange={(e) => handleInputChange(e, "title")}
          placeholder="New task ..."
          className="text-md font-semibold text-text-primary bg-transparent border-none focus:outline-none wrap-break-word w-65 resize-none"
          value={selectedTask?.title || ""}
        />
        <textarea
          ref={resizeTextarea}
          onChange={(e) => handleInputChange(e, "notes")}
          placeholder="Add notes ..."
          className="text-sm font-normal text-text-primary bg-transparent border-none focus:outline-none wrap-break-word w-65 resize-none"
          value={selectedTask?.notes || ""}
        />
        <Button
          onClick={handleAddTask}
          className="w-fit self-end bg-surface-active! text-text-active! hover:bg-transparent! hover:text-text-primary! focus:ring-surface-active shadow-lg"
          size="sm"
        >
          Add Task
        </Button>
      </div>

      {/* Task Detail */}
      <div
        className={`flex flex-col gap-2 p-4 transition-all duration-500 ${editor.type === "TaskDetails" ? "opacity-100" : "hidden opacity-0"}`}
      >
        <textarea
          ref={resizeTextarea}
          onChange={(e) => handleInputChange(e, "title")}
          placeholder="New task ..."
          className="text-md font-semibold text-text-primary bg-transparent border-none focus:outline-none wrap-break-word w-65 resize-none"
          value={selectedTask?.title || ""}
        />
        <textarea
          ref={resizeTextarea}
          onChange={(e) => handleInputChange(e, "notes")}
          placeholder="Add notes ..."
          className="text-sm font-normal text-text-primary bg-transparent border-none focus:outline-none wrap-break-word w-65 resize-none"
          value={selectedTask?.notes || ""}
        />
        <div className="flex flex-row gap-2 w-full justify-end">
          <Button
            onClick={handleDeleteTask}
            className="self-end bg-surface-active! text-text-active! hover:bg-transparent! hover:text-text-primary! focus:ring-surface-active shadow-lg w-20 flex flex-row items-center justify-center"
            size="sm"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
          <Button
            onClick={handleUpdateTask}
            className="self-end bg-surface-active! text-text-active! hover:bg-transparent! hover:text-text-primary! focus:ring-surface-active shadow-lg w-20 flex flex-row items-center justify-center"
            size="sm"
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskEditor;
