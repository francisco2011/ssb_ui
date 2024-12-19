import { faList, faListOl, faUnderline } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import ButtonProps from "./props/IButtonProps";
import {
    INSERT_ORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND
  } from "@lexical/list";



function OrderedListButton({ isActive, currentEditor }: ButtonProps) {

    return(
        <button
        className={clsx(
            "px-1 hover:bg-gray-600 transition-colors duration-100 ease-in",
            isActive ? "bg-gray-600" : "bg-gray-400"
          )}
        onClick={() => {

            if(isActive){
                currentEditor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
            }else{
                currentEditor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
            }
        }}
      >
        <FontAwesomeIcon
          icon={faListOl}
          className="text-white w-3.5 h-3.5"
        />
      </button>
    );

}

export default OrderedListButton;