import { faPaste } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function PasteCopiedFormatButton({ onClickCallback } : {onClickCallback: () => void}) {

    return(
        <button
        className={
          "px-1 hover:bg-gray-600 transition-colors duration-100 ease-in bg-gray-400"
          
        }
        onClick={() => 
                onClickCallback()
        }
      >
        <FontAwesomeIcon
          icon={faPaste}
          className="text-white w-3.5 h-3.5"
        />
      </button>
    );

}

export default PasteCopiedFormatButton;