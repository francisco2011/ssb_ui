import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CLEAR_EDITOR_COMMAND, LexicalEditor } from "lexical";

type LinkButtonProps = {
    onClickCallback: () => void,
    currentEditor: LexicalEditor
}

function ClearEditorButton({ currentEditor, onClickCallback }: LinkButtonProps) {


    const clearEditor = () => {
        currentEditor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
        onClickCallback()
      }

    return(
        <button
        className={
            "px-1 hover:bg-gray-600 transition-colors duration-100 ease-in bg-gray-400"
          }
        onClick={() => clearEditor()}
      >
        <FontAwesomeIcon icon={faTrash}  className="text-white w-3.5 h-3.5" />
      </button>
    );

}

export default ClearEditorButton;