import { ToastProps } from "@/types/toast";
import clsx from "clsx";
import { AlertCircle, CheckCircle, Info, TriangleAlert, X } from "lucide-react";

const Toast = ({ toast, onClose }: ToastProps) => {
  const config = {
    success: {
      icon: CheckCircle,
      className: "bg-green-600",
    },
    error: {
      icon: AlertCircle,
      className: "bg-red-600",
    },
    warning: {
      icon: TriangleAlert,
      className: "bg-yellow-500",
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

      <button onClick={() => onClose(toast.id)} className="hover:opacity-70">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
