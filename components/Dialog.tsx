"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

const Dialog = ({ open, onClose, title, children, className }: DialogProps) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Content */}
      <div
        className={clsx(
          "relative z-10 w-full max-w-md rounded-xl bg-surface-primary border-2 border-border-primary p-6 shadow-xl",
          className,
        )}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{title}</h2>

            <button
              onClick={onClose}
              className="rounded p-1 hover:bg-surface-primary/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default Dialog;
