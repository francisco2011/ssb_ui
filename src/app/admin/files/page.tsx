'use client'

import 'react-complex-tree/lib/style-modern.css';
import StorageExplorer from "~/components/storageExplorer/storageExplorer";

export default function Files() {

    return (
        <>
            <div className="m-4  min-w-full min-h-screen h-dvh">
               <StorageExplorer allowUpload={true}/>
            </div>

        </>
    );
}