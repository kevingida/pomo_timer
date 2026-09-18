import { render, screen, fireEvent, act } from "@testing-library/react";
import Dialog from "@/components/Dialog";
import { PiPProvider } from "@/features/timer/context/PiPContext";

describe("Dialog", () => {
  it("renders nothing when closed", () => {
    render(
      <Dialog open={false} onClose={() => {}} title="Hidden">
        <p>Body</p>
      </Dialog>,
    );

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens as a labelled modal in the main document", () => {
    render(
      <Dialog open onClose={() => {}} title="Reset timer?">
        <p>Body</p>
      </Dialog>,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("open");
    expect(document.body.contains(dialog)).toBe(true);
    expect(dialog).toHaveAccessibleName("Reset timer?");
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("calls onClose from the close button", () => {
    const onClose = jest.fn();
    render(
      <Dialog open onClose={onClose} title="Title">
        <p>Body</p>
      </Dialog>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose on a backdrop click but not on content clicks", () => {
    const onClose = jest.fn();
    render(
      <Dialog open onClose={onClose}>
        <p>Body</p>
      </Dialog>,
    );

    fireEvent.click(screen.getByText("Body"));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the dialog closes natively (e.g. Escape)", () => {
    const onClose = jest.fn();
    render(
      <Dialog open onClose={onClose}>
        <p>Body</p>
      </Dialog>,
    );

    act(() => {
      (screen.getByRole("dialog") as HTMLDialogElement).close();
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("portals into the picture-in-picture container when one is active", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    render(
      <PiPProvider pipContainer={container} isPiPActive>
        <Dialog open onClose={() => {}} title="In PiP">
          <p>Body</p>
        </Dialog>
      </PiPProvider>,
    );

    expect(container.contains(screen.getByRole("dialog"))).toBe(true);

    container.remove();
  });
});
