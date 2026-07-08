export type ToastType = "success" | "error" | "warning" | "info";

export type ToastData = {
  id: number;
  type: ToastType;
  message: string;
};

export type ToastProps = {
  toast: ToastData;
  onClose: (id: number) => void;
};
