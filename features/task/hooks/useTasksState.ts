import { useEffect, useState } from "react";
import { Task } from "../type";
import { move } from "@dnd-kit/helpers";

const STORAGE_KEY = "tasks";

const useTaskState = () => {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const activeTask = taskList.find((task) => task.id === activeTaskId) ?? null;

  const setActiveTask = (taskId: string | null) => {
    setActiveTaskId(taskId);
  };

  const addTask = (task: Task) => {
    setTaskList((prev) => [...prev, task]);
  };

  const deleteTask = (taskId: string) => {
    setTaskList((prev) => prev.filter((task) => task.id !== taskId));
  };

  const updateTask = (updatedTask: Task) => {
    setTaskList((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
  };

  const toggleTaskCompletion = (taskId: string) => {
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
  };

  const incrementCompletedPomodoros = (taskId: string) => {
    setTaskList((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;

        const completedPomodoros = task.completedPomodoros + 1;

        return {
          ...task,
          completedPomodoros,
        };
      }),
    );
  };

  const reorderTasks = (event: Parameters<typeof move>[1]) => {
    setTaskList((prev) => move(prev, event));
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setTaskList(JSON.parse(saved));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(taskList));
  }, [taskList, isLoaded]);

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
