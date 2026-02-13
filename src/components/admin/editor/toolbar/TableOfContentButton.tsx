import { faTableList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

type props = {
    onClickCallback: () => void 
}

function TableOfContentsButton({ onClickCallback }: props) {

  const [editor] = useLexicalComposerContext();

    return(
        <button data-tip="Table of Contents"
        className={"px-1 bg-gray-400 hover:bg-gray-600 tooltip tooltip-primary"}
        onClick={() => {
          onClickCallback
        }}
      >
        <FontAwesomeIcon
          icon={faTableList}
          aria-label="Table of Contents"
          className="text-white w-3.5 h-3.5"
        />
      </button>
    );

}

export default TableOfContentsButton;