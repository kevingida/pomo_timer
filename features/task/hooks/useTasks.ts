import { useEffect, useState } from "react";
import { Task } from "../type";
import { move } from "@dnd-kit/helpers";

const STORAGE_KEY = "tasks";

const useTasks = () => {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

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
  }, [taskList]);

  return {
    taskList,
    addTask,
    deleteTask,
    updateTask,
    toggleTaskCompletion,
    reorderTasks,
  };
};

export default useTasks;
