import { faTable } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";



function InsertTableButton() {

  const [editor] = useLexicalComposerContext();

    return(
        <button
        className={
          "px-1 bg-gray-400 hover:bg-gray-600 transition-colors duration-100 ease-in"
        }
        onClick={() => {
            editor.dispatchCommand(INSERT_TABLE_COMMAND, {columns: '3', rows:'3', includeHeaders: true});

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