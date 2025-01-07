import { faAlignLeft, faAlignRight, faItalic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { FORMAT_ELEMENT_COMMAND } from "lexical";
import ButtonProps from "../props/IButtonProps";




function RightButton({ isActive, currentEditor }: ButtonProps) {

    return(
        <button
        className={clsx(
                  "px-1 hover:bg-gray-600 transition-colors duration-100 ease-in",
                  isActive ? "bg-gray-600" : "bg-gray-400"
                )}
        onClick={() => {
            currentEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
      >
        <FontAwesomeIcon
          icon={faAlignRight}
          className="text-white w-3.5 h-3.5"
        />
      </button>
    );

}

export default RightButton;