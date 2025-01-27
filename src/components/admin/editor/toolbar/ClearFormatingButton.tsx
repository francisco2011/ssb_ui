import { faEraser, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type LinkButtonProps = {
    onClickCallback: any,
}

function ClearFormatingButton({ onClickCallback }: LinkButtonProps) {

    return(
        <button
        className={
            "px-1 hover:bg-gray-600 transition-colors duration-100 ease-in bg-gray-400"
          }
        onClick={() => onClickCallback()}
      >
        <FontAwesomeIcon icon={faEraser}  className="text-white w-3.5 h-3.5" />
      </button>
    );

}

export default ClearFormatingButton;