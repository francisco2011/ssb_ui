import { faAlignLeft, faItalic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND, LexicalEditor } from "lexical";
import ButtonProps from "./props/IButtonProps";



function LeftButton({ isActive, currentEditor }: ButtonProps) {

    return(
        <button
        className={clsx(
          "px-1 bg-gray-400 hover:bg-gray-600 transition-colors duration-100 ease-in"
        )}
        onClick={() => {
            currentEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
      >
        <FontAwesomeIcon
          icon={faAlignLeft}
          className="text-white w-3.5 h-3.5"
        />
      </button>
    );

}

export default LeftButton;