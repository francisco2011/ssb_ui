import { FORMAT_TEXT_COMMAND } from "lexical";
import ButtonProps from "../props/IButtonProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSubscript, faSuperscript } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

function SuperscriptButton({ isActive, currentEditor }: ButtonProps) {

  return(
      <button
      className={clsx(
          "px-1 hover:bg-gray-600 transition-colors duration-100 ease-in",
          isActive ? "bg-gray-600" : "bg-gray-400"
        )}
      onClick={() => {
          currentEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
      }}
    >
      <FontAwesomeIcon icon={faSuperscript} className="text-white w-3.5 h-3.5" />
    </button>
  );

}

export default SuperscriptButton;