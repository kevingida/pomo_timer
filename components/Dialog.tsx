"use client";

import { useEffect, useId, useRef } from "react";
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

// Native <dialog> gives focus trapping, Escape handling, focus restore and an inert
// backdrop for free, and showModal() works per-document so it behaves inside PiP too.
const Dialog = ({ open, onClose, title, children, className }: DialogProps) => {
  const { pipContainer, isPiPActive } = usePiPWindow();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const container =
    typeof document !== "undefined"
      ? isPiPActive && pipContainer
        ? pipContainer
        : document.body
      : null;

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog || typeof dialog.showModal !== "function") return;

    if (!dialog.open) dialog.showModal();

    return () => {
      if (dialog.isConnected && dialog.open) dialog.close();
    };
  }, [open]);

  if (!open || !container) return null;

  const dialogContent = (
    <dialog
      ref={dialogRef}
      aria-labelledby={title ? titleId : undefined}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={clsx(
        "m-auto w-[90%] lg:w-full max-w-md rounded-xl bg-surface-primary border-2 border-border-primary p-0 text-text-primary shadow-xl",
        "backdrop:bg-black/50",
        className,
      )}
    >
      <div className="p-6">
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 id={titleId} className="text-md lg:text-lg font-semibold">
              {title}
            </h2>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded p-1 hover:bg-surface-primary/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {children}
      </div>
    </dialog>
  );

  return createPortal(dialogContent, container);
};

export default Dialog;
