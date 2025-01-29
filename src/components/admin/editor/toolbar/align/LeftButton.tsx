import { faAlignLeft, faItalic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND, LexicalEditor } from "lexical";
import ButtonProps from "../props/IButtonProps";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";




function LeftButton({ isActive }: ButtonProps) {

  const [editor] = useLexicalComposerContext();

    return(
        <button
        className={clsx(
                  "px-1 hover:bg-gray-600 transition-colors duration-100 ease-in",
                  isActive ? "bg-gray-600" : "bg-gray-400"
                )}
        onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
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