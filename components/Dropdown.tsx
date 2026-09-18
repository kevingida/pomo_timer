import { ChevronDown, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  id: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const Dropdown = ({
  id,
  value,
  options,
  onChange,
  placeholder,
  className,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      ref={ref}
      className={`relative min-w-[90px] lg:w-fit  lg:min-w-30 ${className}`}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-border-primary bg-white/5 px-3 py-1.5 lg:px-4 lg:py-2.5 backdrop-blur-lg transition-all hover:bg-white/10"
        id={id}
      >
        <div className="flex items-center gap-2 text-text-primary text-sm lg:text-base">
          {selected?.label ?? placeholder}
        </div>

        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div role="listbox" className=" absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-border-primary/30 bg-surface-active/95 backdrop-blur-lg shadow-2xl">
          {options.map((option) => (
            <button
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-2 lg:px-4 py-3 text-left transition-colors hover:bg-white/10 "
            >
              <div className="flex items-center gap-2 text-text-active text-sm lg:text-base">
                {option.label}
              </div>

              {option.value === value && (
                <Check size={16} className="text-text-active" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
