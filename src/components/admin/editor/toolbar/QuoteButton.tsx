import { faList, faListOl, faQuoteLeft, faQuoteRight, faUnderline } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import ButtonProps from "./props/IButtonProps";
import {
    INSERT_ORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND
  } from "@lexical/list";
import SelectProps from "./props/ISelectProps";
import { useCallback } from "react";



function QuoteButton({ selectedOption, callback }: SelectProps<boolean>) {

    const onClick = useCallback(
        (e: any ) => {
          callback(selectedOption);
        },
        [callback]
      );

    return(
        <button
        className={clsx(
            "px-1 hover:bg-gray-600 transition-colors duration-100 ease-in",
            selectedOption ? "bg-gray-600" : "bg-gray-400"
          )}
        onClick={onClick}
      >
        <FontAwesomeIcon
          icon={faQuoteRight}
          className="text-white w-3.5 h-3.5"
        />
      </button>
    );

}

export default QuoteButton;