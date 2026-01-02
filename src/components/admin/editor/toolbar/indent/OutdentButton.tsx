import { faItalic, faOutdent } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { FORMAT_TEXT_COMMAND, LexicalEditor, OUTDENT_CONTENT_COMMAND } from "lexical";
import ButtonProps from "../props/IButtonProps";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";



function OutdentButton({ isActive }: ButtonProps) {

  const [editor] = useLexicalComposerContext();

    return(
        <button
        className={
            "px-1 hover:bg-gray-600 transition-colors duration-100 ease-in bg-gray-400"
          }
        onClick={() => {
          editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
        }}
      >
        <FontAwesomeIcon icon={faOutdent} className="text-white w-3.5 h-3.5" />
      </button>
    );

}

export default OutdentButton;