import { ReactNode } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
}

// Purely visual: controls carry their own aria-label, so the bubble is hidden from AT
const Tooltip = ({ content, children }: TooltipProps) => {
  return (
    <div className="relative group inline-flex">
      {children}

      <span
        aria-hidden="true"
        className="
          absolute right-0 top-full mt-2 z-50
          whitespace-nowrap rounded-md bg-black px-2 py-1
          text-xs text-white
          opacity-0 scale-95
          transition-all duration-200
          pointer-events-none
          group-hover:opacity-100
          group-hover:scale-100
          group-focus-within:opacity-100
          group-focus-within:scale-100
        "
      >
        {content}
      </span>
    </div>
  );
};

export default Tooltip;
