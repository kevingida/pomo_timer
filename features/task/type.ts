export type Task = {
  id: string;
  title: string;
  completed: boolean;
  estimatedPomodoros: number;
  completedPomodoros: number;
  notes?: string;
  createdAt: string;
  completedAt?: string;
};

export type EditorType = "" | "newTask" | "TaskDetails";

export type Editor = {
  status: boolean;
  type: EditorType;
};
