import { ToastProps } from "@/types/toast";
import clsx from "clsx";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

const Toast = ({ toast, onClose }: ToastProps) => {
  const config = {
    success: {
      icon: CheckCircle,
      className: "bg-success",
    },
    error: {
      icon: AlertCircle,
      className: "bg-error",
    },
    info: {
      icon: Info,
      className: "bg-blue-600",
    },
  };

  const { icon: Icon, className } = config[toast.type];

  return (
    <div
      className={clsx(
        "flex items-center gap-3 rounded-lg px-4 py-3 text-white shadow-lg",
        "animate-in slide-in-from-right",
        className,
      )}
    >
      <Icon className="h-5 w-5" />

      <p className="flex-1 text-sm">{toast.message}</p>

      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onClose(toast.id)}
        className="hover:opacity-70"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
