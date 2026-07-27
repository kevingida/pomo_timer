import Dialog from "./Dialog";
import Button from "./Button";
import useScreenSize from "@/hooks/useScreenSize";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmDialog = ({
  open,
  title,
  description,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const { sm } = useScreenSize();
  return (
    <Dialog open={open} onClose={onCancel} title={title}>
      <p className="text-text-secondary text-sm lg:text-base">{description}</p>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel} size={sm ? "lg" : "sm"}>
          Cancel
        </Button>

        <Button variant="danger" onClick={onConfirm} size={sm ? "lg" : "sm"}>
          Confirm
        </Button>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;
