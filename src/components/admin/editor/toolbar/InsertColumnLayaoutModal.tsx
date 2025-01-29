import { faTableColumns } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InsertLayoutDialog from "../plugins/LayoutPlugin/InsertLayoutDialog";
import useModal from "~/components/useModal";

function InsertColumnLayoutModal({ onContentCallback }: { onContentCallback: (layout: string) => void }) {

    const [modal, showModal] = useModal();

    function closeModal(layout: string) {
        onContentCallback(layout)
        
    }

    return (
        <><button
            className={"px-1 bg-gray-400 hover:bg-gray-600 transition-colors duration-100 ease-in"}
            onClick={() => {
                showModal('Column Layout', (onClose) => (
                    <InsertLayoutDialog onClose={onClose} onData={closeModal} />

                ));
            }}
        >
            <FontAwesomeIcon
                icon={faTableColumns}
                className="text-white w-3.5 h-3.5" />
        </button>
        {modal}
            </>
    );

}

export default InsertColumnLayoutModal;