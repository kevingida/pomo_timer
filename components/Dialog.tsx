"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import clsx from "clsx";
import { usePiPWindow } from "@/features/timer/context/PiPContext";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

const Dialog = ({ open, onClose, title, children, className }: DialogProps) => {
  const { pipContainer, isPiPActive } = usePiPWindow();

  const container =
    typeof document !== "undefined"
      ? isPiPActive && pipContainer
        ? pipContainer
        : document.body
      : null;
  const targetDoc = container?.ownerDocument ?? null;

  useEffect(() => {
    if (!targetDoc || !open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    targetDoc.addEventListener("keydown", handleEscape);

    return () => {
      targetDoc.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, targetDoc, open]);

  if (!open || !container || !targetDoc) return null;

  // Use absolute positioning in PiP mode, fixed in main window
  const positionClass = isPiPActive ? "absolute" : "fixed";

  const dialogContent = (
    <div
      className={`${positionClass} inset-0 z-50 flex items-center justify-center`}
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Content */}
      <div
        className={clsx(
          "relative z-10 w-[90%] lg:w-full max-w-md rounded-xl bg-surface-primary border-2 border-border-primary p-6 shadow-xl",
          className,
        )}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-md lg:text-lg font-semibold">{title}</h2>

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

  // Portal to the correct document (main or PiP)
  return createPortal(dialogContent, container);
};

export default Dialog;
