import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type TouchEvent,
} from "react";

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

const Slider = ({ min, max, value, onChange }: SliderProps) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const pct = ((value - min) / (max - min)) * 100;

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(
        1,
        Math.max(0, (clientX - rect.left) / rect.width),
      );
      const raw = min + ratio * (max - min);
      onChange(Math.round(raw));
    },
    [min, max, onChange],
  );

  const handlePointerDown = (
    e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
  ) => {
    setDragging(true);
    const clientX = "touches" in e ? e.touches[0]?.clientX : e.clientX;
    if (typeof clientX === "number") updateFromClientX(clientX);
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e: globalThis.MouseEvent | globalThis.TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0]?.clientX : e.clientX;
      if (typeof clientX === "number") updateFromClientX(clientX);
    };
    const up = () => setDragging(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
  }, [dragging, updateFromClientX]);
  return (
    <div
      ref={trackRef}
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      className="relative h-7 flex items-center cursor-pointer touch-none "
    >
      <div className="relative w-full h-1 rounded-full bg-border-primary">
        <p className="absolute left-0  top-2 text-xs font-medium text-text-primary">
          {min}
        </p>
        <p className="absolute right-0  top-2 text-xs font-medium text-text-primary">
          {max}
        </p>
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-linear-to-r from-surface-active/20 to-surface-active"
          style={{ width: `${pct}%` }}
        />
        <div
          className={`absolute top-1/2 w-3 h-3 
                  rounded-full bg-text-primary transition-all duration-20
                  -translate-x-1/2 -translate-y-1/2
                  ${dragging ? "scale-[1.15]" : "scale-100"}`}
          style={{
            left: `${pct}%`,
            boxShadow: dragging
              ? "0 0 0 5px color-mix(in srgb, var(--color-text-primary) 35%, transparent)"
              : "0 1px 3px color-mix(in srgb, var(--color-text-primary) 40%, transparent)",
          }}
        />
      </div>
    </div>
  );
};

export default Slider;
