"use client";

import Toast from "@/components/Toast";
import { ToastData, ToastType } from "@/types/toast";
import { createContext, useCallback, useState } from "react";

type ToastContextType = {
  showToast: (type: ToastType, message: string) => void;
};

export const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string) => {
      const id = Date.now();

      setToasts((prev) => [
        ...prev,
        {
          id,
          type,
          message,
        },
      ]);

      // auto close after 3 seconds
      setTimeout(() => {
        removeToast(id);
      }, 3000);
    },
    [removeToast],
  );
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div
        role="status"
        aria-live="polite"
        className="fixed right-5 top-5 z-50 flex flex-col gap-3"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
