import { useState } from "react";

type DialogState = {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
};

const initialState: DialogState = {
  open: false,
  title: "",
  description: "",
  onConfirm: () => {},
};

const useDialog = () => {
  const [dialog, setDialog] = useState(initialState);

  const openDialog = (
    title: string,
    description: string,
    confirm: () => void,
  ) => {
    setDialog({
      open: true,
      title,
      description,
      onConfirm: () => {
        confirm();
        closeDialog();
      },
    });
  };

  const closeDialog = () => {
    setDialog((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return {
    dialog,
    openDialog,
    closeDialog,
  };
};

export default useDialog;
