"use client";
import Button from "@/components/Button";
import { ListTodo, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { EditorType, Task as Tasktype } from "./type";
import { useToast } from "@/hooks/useToast";
import TasksList from "./components/TasksList";
import useTaskEditor from "./hooks/useTaskEditor";
import TaskEditor from "./components/Taskeditor";
import Tooltip from "@/components/Tooltip";
import useTasks from "./hooks/useTasks";

interface TaskProps {
  toggleTask: (state?: boolean) => void;
  isTaskOpen: boolean;
}

const createInitialTask = (): Tasktype => ({
  id: crypto.randomUUID(),
  title: "",
  notes: "",
  completed: false,
  estimatedPomodoros: 0,
  completedPomodoros: 0,
  createdAt: new Date().toISOString(),
});

const Task = ({ toggleTask, isTaskOpen }: TaskProps) => {
  const [selectedTask, setSelectedTask] = useState<Tasktype>(createInitialTask);

  const {
    taskList,
    addTask,
    deleteTask,
    updateTask,
    toggleTaskCompletion,
    reorderTasks,
    setActiveTask,
  } = useTasks();

  const { editor, openEditor, closeEditor } = useTaskEditor();

  const toast = useToast();

  const resizeTextarea = (element: HTMLTextAreaElement | null) => {
    if (!element) return;

    element.style.height = "0px";
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleOpenTask = (editorType: EditorType, taskDetail?: Tasktype) => {
    if (
      editor.status &&
      editor.type === "TaskDetails" &&
      taskDetail?.id === selectedTask.id
    ) {
      closeEditor();
      return;
    }
    if (editorType === "newTask") resetTask();
    if (editorType === "TaskDetails" && taskDetail) setSelectedTask(taskDetail);
    openEditor(editorType);
  };

  const handleDeleteTask = () => {
    deleteTask(selectedTask.id);
    resetTask();
    closeEditor();
  };

  const handleInputChange = (
    field: keyof Tasktype,
    event?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    value?: number,
  ) => {
    setSelectedTask({
      ...selectedTask,
      [field]: value !== undefined ? value : event?.target.value,
    });
  };

  const validateTask = () => {
    const title = selectedTask?.title?.trim();

    if (!title) {
      toast.showToast("error", "Task title cannot be empty");
      return null;
    }

    return {
      ...selectedTask,
      title,
      notes: selectedTask?.notes?.trim() || "",
    };
  };

  const handleAddTask = () => {
    const newTask = validateTask();
    if (!newTask) return;

    addTask(newTask);
    resetTask();
    closeEditor();
  };

  const resetTask = () => {
    setSelectedTask(createInitialTask());
  };

  useEffect(() => {
    const activeTaskId = taskList.find((task) => !task.completed)?.id ?? null;
    setActiveTask(activeTaskId);
  }, [taskList, setActiveTask]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateTask(selectedTask);
    }, 500);

    return () => clearTimeout(timeout);
  }, [selectedTask]);

  return (
    <div className="relative">
      <Tooltip content="Tasks">
        <Button onClick={() => toggleTask()}>
          <ListTodo />
        </Button>
      </Tooltip>
      {isTaskOpen && (
        <div className="absolute top-full right-0 mt-2 h-[90vh] w-100 flex p-4 flex-col gap-2 rounded-[20px] transition-all duration-500 backdrop-blur-lg bg-transparent shadow-lg">
          <div className="flex flex-row justify-between items-center h-5 mb-4">
            <h2 className="text-lg font-bold text-text-primary">Tasks</h2>
            <Button
              className={`flex flex-row items-center gap-2 transition-all duration-500 ${editor.type === "newTask" ? "opacity-0 -translate-y-2 pointer-events-none" : "opacity-100 translate-y-0"}`}
              onClick={() => handleOpenTask("newTask")}
              size="sm"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </div>
          <TaskEditor
            selectedTask={selectedTask}
            editor={editor}
            closeEditor={closeEditor}
            handleInputChange={handleInputChange}
            handleAddTask={handleAddTask}
            handleDeleteTask={handleDeleteTask}
            resizeTextarea={resizeTextarea}
          />

          <TasksList
            taskList={taskList}
            reorderTasks={reorderTasks}
            handleOpenTask={handleOpenTask}
            handleCompleteTask={toggleTaskCompletion}
          />
        </div>
      )}
    </div>
  );
};

export default Task;
