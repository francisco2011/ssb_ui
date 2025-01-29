import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { UNDO_COMMAND } from "lexical";
import ButtonProps from "./props/IButtonProps";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";



function UndoButton({ isActive }: ButtonProps) {

  const [editor] = useLexicalComposerContext();

    return(
        <button
        disabled={!isActive}
        className={clsx(
          "px-1 bg-gray-400 hover:bg-gray-600 transition-colors duration-100 ease-in"
        )}
        onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
      >
        <FontAwesomeIcon
          icon={faRotateLeft}
          className="text-white w-3.5 h-3.5"
        />
      </button>
    );

}

export default UndoButton;