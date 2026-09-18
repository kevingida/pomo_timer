import { renderHook } from "@testing-library/react";
import useDocumentTitle from "@/features/timer/hooks/useDocumentTitle";
import { TimerStatus } from "@/features/timer/type";

type Props = { remaining: number; status: TimerStatus };

const renderTitle = (initialProps: Props) =>
  renderHook((props: Props) => useDocumentTitle(props), { initialProps });

describe("useDocumentTitle", () => {
  it("shows the countdown while running", () => {
    renderTitle({ remaining: 1499, status: "running" });

    expect(document.title).toBe("🍅 24:59 - Pomodoro Timer");
  });

  it("marks a paused timer", () => {
    renderTitle({ remaining: 1499, status: "paused" });

    expect(document.title).toBe("⏸ 24:59 - Pomodoro Timer");
  });

  it("uses the plain title when idle and restores it on unmount", () => {
    const { rerender, unmount } = renderTitle({
      remaining: 1499,
      status: "running",
    });

    rerender({ remaining: 1500, status: "idle" });
    expect(document.title).toBe("Pomodoro Timer");

    rerender({ remaining: 1200, status: "running" });
    expect(document.title).toBe("🍅 20:00 - Pomodoro Timer");

    unmount();
    expect(document.title).toBe("Pomodoro Timer");
  });
});
