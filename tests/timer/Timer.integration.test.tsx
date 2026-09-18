import { render, screen, act, fireEvent } from "@testing-library/react";
import { useEffect } from "react";
import Timer from "@/features/timer";
import SettingsProvider from "@/features/settings/providers/SettingsProvider";
import { ThemeProvider } from "@/features/theme/providers/ThemeProvider";
import { TaskProvider } from "@/features/task/providers/TaskProvider";
import useTasks from "@/features/task/hooks/useTasks";

jest.mock("@/features/timer/hooks/useSound", () => {
  const handlePlaySound = jest.fn();
  return { __esModule: true, default: () => ({ handlePlaySound }) };
});

const { handlePlaySound } = (
  jest.requireMock("@/features/timer/hooks/useSound") as {
    default: () => { handlePlaySound: jest.Mock };
  }
).default();

const MINUTE = 60_000;

const ActivateFirstTask = () => {
  const { taskList, setActiveTask } = useTasks();
  useEffect(() => {
    setActiveTask(taskList[0]?.id ?? null);
  }, [taskList, setActiveTask]);
  return null;
};

const renderTimer = () =>
  render(
    <SettingsProvider>
      <ThemeProvider>
        <TaskProvider>
          <ActivateFirstTask />
          <Timer isDropdownOpen={false} />
        </TaskProvider>
      </ThemeProvider>
    </SettingsProvider>,
  );

const startButton = () => screen.getByRole("button", { name: /start/i });
const pauseButton = () => screen.getByRole("button", { name: /pause/i });
const tab = (name: string) => screen.getByRole("tab", { name });
const confirm = () => fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

beforeEach(() => {
  jest.useFakeTimers();
  handlePlaySound.mockClear();
  localStorage.setItem(
    "settings",
    JSON.stringify({
      focusDuration: 5,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4,
      autoStartBreaks: true,
      autoStartPomodoros: false,
      soundEnabled: true,
      volume: 100,
      focusEndSound: "bell",
      breakEndSound: "tick",
    }),
  );
  localStorage.setItem(
    "tasks",
    JSON.stringify([
      {
        id: "t1",
        title: "Write tests",
        completed: false,
        estimatedPomodoros: 2,
        completedPomodoros: 0,
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ]),
  );
});

afterEach(() => {
  jest.useRealTimers();
});

describe("Timer session flow", () => {
  it("finishes a focus session: sound, task credit, break mode, auto-start", () => {
    renderTimer();
    expect(screen.getByText("5:00")).toBeInTheDocument();
    expect(tab("Focus")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Write tests")).toBeInTheDocument();

    fireEvent.click(startButton());
    act(() => {
      jest.advanceTimersByTime(5 * MINUTE);
    });

    expect(handlePlaySound).toHaveBeenCalledWith("bell");
    expect(tab("Short Break")).toHaveAttribute("aria-selected", "true");
    expect(JSON.parse(localStorage.getItem("tasks")!)[0].completedPomodoros).toBe(1);
    expect(screen.getByText("5:00")).toBeInTheDocument();

    // Auto-start fires after 1s; the new interval registers when React flushes, so tick separately
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(document.title).toMatch(/^🍅 4:59/);
  });

  it("does not auto-start focus after a break when autoStartPomodoros is off", () => {
    renderTimer();
    fireEvent.click(tab("Short Break"));
    fireEvent.click(startButton());

    act(() => {
      jest.advanceTimersByTime(5 * MINUTE + 2000);
    });

    expect(handlePlaySound).toHaveBeenCalledWith("tick");
    expect(tab("Focus")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("5:00")).toBeInTheDocument();
    expect(document.title).toBe("Pomodoro Timer");
    expect(JSON.parse(localStorage.getItem("tasks")!)[0].completedPomodoros).toBe(0);
  });

  it("asks for confirmation before pausing and honors the answer", () => {
    renderTimer();
    fireEvent.click(startButton());
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    fireEvent.click(pauseButton());
    expect(screen.getByText("Pause timer?")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByText("Pause timer?")).toBeNull();
    expect(document.title).toMatch(/^🍅/);

    fireEvent.click(pauseButton());
    confirm();
    expect(document.title).toMatch(/^⏸ 4:59/);
  });

  it("confirms before resetting a running session", () => {
    renderTimer();
    fireEvent.click(startButton());
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.click(screen.getByRole("button", { name: "Reset timer" }));
    expect(screen.getByText("Reset timer?")).toBeInTheDocument();
    confirm();

    expect(screen.getByText("5:00")).toBeInTheDocument();
    expect(document.title).toBe("Pomodoro Timer");
  });

  it("confirms before switching mode mid-session", () => {
    renderTimer();
    fireEvent.click(startButton());
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    fireEvent.click(tab("Long Break"));
    expect(screen.getByText("Stop current session?")).toBeInTheDocument();
    confirm();

    expect(tab("Long Break")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("15:00")).toBeInTheDocument();
    expect(document.title).toBe("Pomodoro Timer");
  });
});
