import { faColumns, faImage, faTableColumns, faUnderline } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { FORMAT_TEXT_COMMAND, LexicalEditor } from "lexical";

import { useEffect, useState } from "react";
import { JSX } from "react/jsx-runtime";
import InsertLayoutDialog from "../plugins/LayoutPlugin/InsertLayoutDialog";

const CAN_USE_DOM: boolean =
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof window.document.createElement !== 'undefined';

function Dialog({
    activeEditor,
    onClose
}: {
    activeEditor: LexicalEditor;
    onClose: () => void;
}): JSX.Element {


    return (
        <>
            <InsertLayoutDialog activeEditor={activeEditor} onClose={onClose} />
        </>
    );
}

function InsertColumnLayoutModal({ currentEditor }) {

    function closeModal() {
        const modal = document.getElementById('my_modal_layout') as any;
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

                    <Dialog
                        activeEditor={currentEditor}
                        onClose={closeModal}
                    />

                </div>
            </dialog></>
    );

}

export default InsertColumnLayoutModal;