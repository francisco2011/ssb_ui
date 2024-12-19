import { faAlignJustify, faItalic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND, LexicalEditor } from "lexical";
import ButtonProps from "./props/IButtonProps";



function JustifyButton({ isActive, currentEditor }: ButtonProps) {

    return(
        <button
        className={
          "px-1 bg-gray-400 hover:bg-gray-700 transition-colors duration-100 ease-in"
        }
        onClick={() => {
            currentEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
      >
        <FontAwesomeIcon
          icon={faAlignJustify}
          className="text-white w-3.5 h-3.5"
        />
      </button>
    );

}

export default JustifyButton;