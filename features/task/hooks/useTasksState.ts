import { useCallback, useState } from "react";
import { Task } from "../type";
import { move } from "@dnd-kit/helpers";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

const STORAGE_KEY = "tasks";
const NO_TASKS: Task[] = [];

const isTask = (value: unknown): value is Task =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as Task).id === "string" &&
  typeof (value as Task).title === "string";

const normalizeTasks = (saved: unknown, defaults: Task[]): Task[] =>
  Array.isArray(saved) ? saved.filter(isTask) : defaults;

const useTaskState = () => {
  const [taskList, setTaskList] = useLocalStorageState(
    STORAGE_KEY,
    NO_TASKS,
    normalizeTasks,
  );
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const activeTask = taskList.find((task) => task.id === activeTaskId) ?? null;

  const setActiveTask = useCallback((taskId: string | null) => {
    setActiveTaskId(taskId);
  }, []);

  const addTask = useCallback(
    (task: Task) => {
      setTaskList((prev) => [...prev, task]);
    },
    [setTaskList],
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      setTaskList((prev) => prev.filter((task) => task.id !== taskId));
    },
    [setTaskList],
  );

  const updateTask = useCallback(
    (updatedTask: Task) => {
      setTaskList((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
      );
    },
    [setTaskList],
  );

  const toggleTaskCompletion = useCallback(
    (taskId: string) => {
      setTaskList((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                completed: !task.completed,
                completedAt: !task.completed
                  ? new Date().toISOString()
                  : undefined,
              }
            : task,
        ),
      );
    },
    [setTaskList],
  );

  const incrementCompletedPomodoros = useCallback(
    (taskId: string) => {
      setTaskList((prev) =>
        prev.map((task) => {
          if (task.id !== taskId) return task;
          return {
            ...task,
            completedPomodoros: task.completedPomodoros + 1,
          };
        }),
      );
    },
    [setTaskList],
  );

  const reorderTasks = useCallback(
    (event: Parameters<typeof move>[1]) => {
      setTaskList((prev) => move(prev, event));
    },
    [setTaskList],
  );

  return {
    taskList,
    activeTask,
    activeTaskId,
    setActiveTask,
    addTask,
    deleteTask,
    updateTask,
    toggleTaskCompletion,
    reorderTasks,
    incrementCompletedPomodoros,
  };
};

export default useTaskState;
