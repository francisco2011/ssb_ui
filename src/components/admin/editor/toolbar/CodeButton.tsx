import { faAlignLeft, faAlignRight, faCode, faItalic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND } from "lexical";
import ButtonProps from "./props/IButtonProps";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";



function CodeButton({ isActive }: ButtonProps) {

  const [editor] = useLexicalComposerContext();

    return(
        <button
        className={clsx(
          "px-1 bg-gray-400 hover:bg-gray-600 transition-colors duration-100 ease-in"
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
        }}
      >
        <FontAwesomeIcon
          icon={faCode}
          className="text-white w-3.5 h-3.5"
        />
      </button>
    );

}

export default CodeButton;