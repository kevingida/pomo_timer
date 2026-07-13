import { useState } from "react";
import { Editor, EditorType } from "../type";

const useTaskEditor = () => {
  const [editor, setEditor] = useState<Editor>({
    status: false,
    type: "",
  });

  const openEditor = (type: EditorType) => {
    setEditor({
      status: true,
      type,
    });
  };

  const closeEditor = () => {
    setEditor({
      status: false,
      type: "",
    });
  };

  return {
    editor,
    openEditor,
    closeEditor,
  };
};

export default useTaskEditor;
