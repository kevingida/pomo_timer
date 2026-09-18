import { render, screen, fireEvent } from "@testing-library/react";
import Slider from "@/components/Slider";
import NumberInput from "@/components/NumberInput";

const mockTrack = (element: HTMLElement) =>
  jest.spyOn(element, "getBoundingClientRect").mockReturnValue({
    left: 0,
    width: 200,
    top: 0,
    height: 28,
    right: 200,
    bottom: 28,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);

describe("Slider", () => {
  it("exposes its value through ARIA", () => {
    render(<Slider min={0} max={100} value={50} onChange={() => {}} label="Volume" />);

    const slider = screen.getByRole("slider", { name: "Volume" });
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
    expect(slider).toHaveAttribute("aria-valuenow", "50");
  });

  it("maps pointer position on the track to a value while dragging", () => {
    const onChange = jest.fn();
    render(<Slider min={0} max={100} value={50} onChange={onChange} label="Volume" />);
    const slider = screen.getByRole("slider", { name: "Volume" });
    mockTrack(slider);

    fireEvent.mouseDown(slider, { clientX: 150 });
    expect(onChange).toHaveBeenLastCalledWith(75);

    fireEvent.mouseMove(window, { clientX: 20 });
    expect(onChange).toHaveBeenLastCalledWith(10);

    fireEvent.mouseUp(window);
    fireEvent.mouseMove(window, { clientX: 100 });
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("supports touch and clamps to the track edges", () => {
    const onChange = jest.fn();
    render(<Slider min={0} max={100} value={50} onChange={onChange} label="Volume" />);
    const slider = screen.getByRole("slider", { name: "Volume" });
    mockTrack(slider);

    fireEvent.touchStart(slider, { touches: [{ clientX: 500 }] });
    expect(onChange).toHaveBeenLastCalledWith(100);
  });

  it("steps by ten with Shift and clamps at the bounds", () => {
    const onChange = jest.fn();
    render(<Slider min={0} max={100} value={95} onChange={onChange} label="Volume" />);
    const slider = screen.getByRole("slider", { name: "Volume" });

    fireEvent.keyDown(slider, { key: "ArrowUp", shiftKey: true });
    expect(onChange).toHaveBeenLastCalledWith(100);

    fireEvent.keyDown(slider, { key: "ArrowDown" });
    expect(onChange).toHaveBeenLastCalledWith(94);

    fireEvent.keyDown(slider, { key: "Tab" });
    expect(onChange).toHaveBeenCalledTimes(2);
  });
});

describe("NumberInput", () => {
  it("strips non-digits while typing and shows the unit", () => {
    const onChange = jest.fn();
    render(
      <NumberInput label="Focus" value={25} min={5} max={120} unit="min" onChange={onChange} onCommit={() => {}} />,
    );

    fireEvent.change(screen.getByRole("textbox", { name: "Focus" }), {
      target: { value: "4a5" },
    });

    expect(onChange).toHaveBeenCalledWith(45);
    expect(screen.getByText("min")).toBeInTheDocument();
  });

  it("commits a clamped value on blur and on Enter", () => {
    const onCommit = jest.fn();
    render(
      <NumberInput label="Focus" value={999} min={5} max={120} onCommit={onCommit} />,
    );
    const input = screen.getByRole("textbox", { name: "Focus" });

    fireEvent.blur(input);
    expect(onCommit).toHaveBeenLastCalledWith(120);

    input.focus();
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onCommit).toHaveBeenCalledTimes(2);
  });
});
