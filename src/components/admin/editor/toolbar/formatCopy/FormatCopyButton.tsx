import { faCopy, faPaintBrush, faPaintRoller } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function FormatCopyButton({ onClickCallback } : {onClickCallback: () => void}) {

    return(
        <button
        className=
                "px-1 bg-gray-400 hover:bg-gray-700 transition-colors duration-100 ease-in"
        onClick={() => 
                onClickCallback()
        }
      >
        <FontAwesomeIcon
          icon={faPaintRoller}
          className="text-white w-3.5 h-3.5"
        />
      </button>
    );

}

export default FormatCopyButton;