import { render, screen, fireEvent, act } from "@testing-library/react";
import Task from "@/features/task";
import { TaskProvider } from "@/features/task/providers/TaskProvider";
import { ToastProvider } from "@/providers/ToastProvider";

const renderPanel = () =>
  render(
    <TaskProvider>
      <ToastProvider>
        <Task toggleDropdown={() => {}} isTaskOpen />
      </ToastProvider>
    </TaskProvider>,
  );

const savedTasks = () => JSON.parse(localStorage.getItem("tasks") ?? "[]");
const submitButton = () =>
  screen.getAllByRole("button", { name: "Add Task" }).at(-1)!;
const openEditor = () =>
  fireEvent.click(screen.getAllByRole("button", { name: "Add Task" })[0]);

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("Task panel", () => {
  it("rejects an empty title with a toast", () => {
    renderPanel();
    openEditor();

    fireEvent.click(submitButton());

    expect(screen.getByText("Task title cannot be empty")).toBeInTheDocument();
    expect(savedTasks()).toHaveLength(0);
  });

  it("adds a task with a trimmed title, then completes and deletes it", () => {
    renderPanel();
    openEditor();

    fireEvent.change(screen.getByLabelText("Task title"), {
      target: { value: "  Ship it  " },
    });
    fireEvent.click(submitButton());

    expect(savedTasks()).toMatchObject([{ title: "Ship it", completed: false }]);
    expect(screen.getByRole("button", { name: /ship it/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Mark as completed" }));
    expect(savedTasks()[0].completed).toBe(true);
    expect(
      screen.getByRole("button", { name: "Mark as not completed" }),
    ).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: /ship it/i }));
    fireEvent.click(screen.getByRole("button", { name: "Delete task" }));

    expect(savedTasks()).toHaveLength(0);
    expect(screen.queryByRole("button", { name: /ship it/i })).toBeNull();
  });

  it("saves edits to an existing task after a short debounce", () => {
    localStorage.setItem(
      "tasks",
      JSON.stringify([
        {
          id: "t1",
          title: "Write docs",
          completed: false,
          estimatedPomodoros: 0,
          completedPomodoros: 0,
          createdAt: "2026-01-01T00:00:00.000Z",
        },
      ]),
    );
    renderPanel();

    fireEvent.click(screen.getByRole("button", { name: /write docs/i }));
    fireEvent.change(screen.getByLabelText("Task notes"), {
      target: { value: "Cover the PiP mode" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Increase estimated pomodoros" }),
    );

    act(() => {
      jest.advanceTimersByTime(600);
    });

    expect(savedTasks()[0]).toMatchObject({
      id: "t1",
      notes: "Cover the PiP mode",
      estimatedPomodoros: 1,
    });
    expect(screen.getByRole("button", { name: /write docs/i })).toHaveTextContent(
      "0/1",
    );
  });
});
