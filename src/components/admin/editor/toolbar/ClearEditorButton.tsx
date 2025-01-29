import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CLEAR_EDITOR_COMMAND, LexicalEditor } from "lexical";

type LinkButtonProps = {
    onClickCallback: () => void,
}

function ClearEditorButton({ onClickCallback }: LinkButtonProps) {

  const [editor] = useLexicalComposerContext();

    const clearEditor = () => {
      editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
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