"use client";

import { createContext } from "react";
import useTaskState from "../hooks/useTasksState";

type TaskContextType = ReturnType<typeof useTaskState>;

export const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const tasks = useTaskState();

  return <TaskContext.Provider value={tasks}>{children}</TaskContext.Provider>;
}
