import React, { Dispatch, useCallback, useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faSave } from "@fortawesome/free-solid-svg-icons";


type Props = {
    onsaveCallback: () => Promise<void>,
}

export default function VerticalToolbar({ onsaveCallback }: Props) {

    return (
        <div className="menu bg-base-200 mt-4 mr-1 rounded-box sticky top-3">

            <div className="m-1 tooltip tooltip-left" data-tip="save">
            <button
            className=""
            onClick={() => {

                onsaveCallback()
            }}
        >
            <FontAwesomeIcon
                icon={faSave}
                className="text-black w-6 h-6"
            />
        </button>
            </div>
            <div className="m-1 tooltip tooltip-left" data-tip="preview">

                <button
                    className={''}
                    onClick={() => {

                    }}
                >
                    <FontAwesomeIcon
                        icon={faEye}
                        className="text-black w-6 h-6"
                    />
                </button>

            </div>



        </div>

    );
}

