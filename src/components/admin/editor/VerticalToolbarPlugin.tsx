import React, { Dispatch, useCallback, useContext, useEffect, useRef, useState } from "react";
import SaveContentModal from "./verticalToolbar/SaveContentModal";
import ContentMetadaModel from "~/models/ContentMetadata";
import ClearEditorButton from "./verticalToolbar/ClearEditorButton";
import PublishButton from "./verticalToolbar/PublishButton";


type Props = {
    onsaveCallback: (post: ContentMetadaModel) => Promise<void>,
    onCleanCallback: () => void,
    onChangePublicationState: () => void
}

export default function VerticalToolbarPlugin({ onsaveCallback, onCleanCallback, onChangePublicationState }: Props) {

    return (
        <div className="menu bg-base-200 mt-4 mr-1 rounded-box sticky top-3">

            <div className="m-1 tooltip tooltip-left" data-tip="save">
                <SaveContentModal onSave={onsaveCallback} />
            </div>
            <div className="m-1 tooltip tooltip-left" data-tip="clean">
                <ClearEditorButton onClick={onCleanCallback} />
            </div>
            <div className="m-1 tooltip tooltip-left" data-tip="publish">
                <PublishButton onClick={onChangePublicationState} />
            </div>
        </div>

    );
}

