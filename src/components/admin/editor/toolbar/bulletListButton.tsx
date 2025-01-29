import { faList, faUnderline } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import ButtonProps from "./props/IButtonProps";
import {
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND
  } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";



function BulletListButton({ isActive }: ButtonProps) {

  const [editor] = useLexicalComposerContext();

    return(
        <button
        className={clsx(
            "px-1 hover:bg-gray-600 transition-colors duration-100 ease-in",
            isActive ? "bg-gray-600" : "bg-gray-400"
          )}
        onClick={() => {

            if(isActive){
                editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
            }else{
                editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
            }
        }}
      >
        <FontAwesomeIcon
          icon={faList}
          className="text-white w-3.5 h-3.5"
        />
      </button>
    );

}

export default BulletListButton;