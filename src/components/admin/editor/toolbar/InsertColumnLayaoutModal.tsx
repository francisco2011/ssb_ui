import { faTableColumns } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LexicalEditor } from "lexical";

import { JSX } from "react/jsx-runtime";
import InsertLayoutDialog from "../plugins/LayoutPlugin/InsertLayoutDialog";
import { INSERT_LAYOUT_COMMAND } from "../plugins/LayoutPlugin";

const CAN_USE_DOM: boolean =
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof window.document.createElement !== 'undefined';

function Dialog({
    onClose
}: {
    onClose: (layout: string) => void;
}): JSX.Element {


    return (
        <>
            <InsertLayoutDialog onClose={onClose} />
        </>
    );
}

function InsertColumnLayoutModal({ onContentCallback }: { onContentCallback: (layout: string) => void }) {

    function closeModal(layout: string) {
        const modal = document.getElementById('my_modal_layout') as any;

        onContentCallback(layout)

        modal.close()
    }

    return (
        <><button
            className={"px-1 bg-gray-400 hover:bg-gray-600 transition-colors duration-100 ease-in"}
            onClick={() => {
                if (CAN_USE_DOM) {

                    const modal: any = CAN_USE_DOM && document ? document.getElementById('my_modal_layout') : null
                    if (modal) modal.showModal()
                }
            }}
        >
            <FontAwesomeIcon
                icon={faTableColumns}
                className="text-white w-3.5 h-3.5" />
        </button>
            <dialog id="my_modal_layout" className="modal">
                <div className="modal-box">

                    <Dialog onClose={closeModal} />

                </div>
            </dialog></>
    );

}

export default InsertColumnLayoutModal;