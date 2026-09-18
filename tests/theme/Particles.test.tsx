import { render } from "@testing-library/react";
import Particles from "@/features/theme/components/Particles";

describe("Particles", () => {
  it("renders nothing for the none type", () => {
    const { container } = render(
      <Particles type="none" opacity={100} speed="medium" />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it.each([
    ["stars", 60],
    ["rain", 100],
    ["snow", 60],
    ["fireflies", 30],
  ] as const)("renders %s as %i particles with speed and opacity", (type, count) => {
    const { container } = render(
      <Particles type={type} opacity={40} speed="fast" />,
    );

    const layer = container.firstElementChild as HTMLElement;
    expect(layer).toHaveClass(`particles-${type}`, `particles-${type}-fast`);
    expect(layer.style.getPropertyValue("--particle-opacity")).toBe("0.4");
    expect(layer.querySelectorAll(`.particle-${type}`)).toHaveLength(count);
  });

  it("rebuilds the particles when the type changes", () => {
    const { container, rerender } = render(
      <Particles type="snow" opacity={100} speed="slow" />,
    );

    rerender(<Particles type="fireflies" opacity={100} speed="slow" />);

    const layer = container.firstElementChild as HTMLElement;
    expect(layer.querySelectorAll(".particle-snow")).toHaveLength(0);
    expect(layer.querySelectorAll(".particle-fireflies")).toHaveLength(30);
  });
});
