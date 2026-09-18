import Dialog from "./Dialog";
import Button from "./Button";

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
  return (
    <Dialog open={open} onClose={onCancel} title={title}>
      <p className="text-text-secondary text-sm lg:text-base">{description}</p>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel} size="responsive">
          Cancel
        </Button>

        <Button variant="danger" onClick={onConfirm} size="responsive">
          Confirm
        </Button>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;
