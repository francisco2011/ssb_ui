'use client'

import 'react-complex-tree/lib/style-modern.css';
import StorageExplorer from "~/components/storageExplorer/storageExplorer";

export default function Files() {

    return (
        <>

            <div>
                <h1 className='font-extrabold text-4xl mt-4'>Storage</h1>
            </div>


            <div className="m-4   min-h-screen h-dvh">


                <StorageExplorer allowUpload={true} />
            </div>

        </>
    );
}