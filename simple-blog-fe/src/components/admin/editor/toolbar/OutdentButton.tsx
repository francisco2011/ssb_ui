import { faItalic, faOutdent } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { FORMAT_TEXT_COMMAND, LexicalEditor, OUTDENT_CONTENT_COMMAND } from "lexical";
import ButtonProps from "./props/IButtonProps";



function OutdentButton({ isActive, currentEditor }: ButtonProps) {

    return(
        <button
        className={
            "px-1 hover:bg-gray-600 transition-colors duration-100 ease-in bg-gray-400"
          }
        onClick={() => {
            currentEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
        }}
      >
        <FontAwesomeIcon icon={faOutdent} className="text-white w-3.5 h-3.5" />
      </button>
    );

}

export default OutdentButton;