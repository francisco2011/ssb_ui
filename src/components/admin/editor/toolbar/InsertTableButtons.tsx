import { faRotateLeft, faRotateRight, faTable } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { LexicalEditor, REDO_COMMAND, UNDO_COMMAND } from "lexical";
import ButtonProps from "./props/IButtonProps";
import { INSERT_TABLE_COMMAND } from "@lexical/table";



function InsertTableButton({ currentEditor }: {currentEditor: LexicalEditor}) {

    return(
        <button
        className={clsx(
          "px-1 bg-gray-400 hover:bg-gray-600 transition-colors duration-100 ease-in"
        )}
        onClick={() => {
            currentEditor.dispatchCommand(INSERT_TABLE_COMMAND, {columns: '3', rows:'3', includeHeaders: true});

        }}
      >
        <FontAwesomeIcon
          icon={faTable}
          className="text-white w-3.5 h-3.5"
        />
      </button>
    );

}

export default InsertTableButton;