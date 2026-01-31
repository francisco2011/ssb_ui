'use client'

import { useEffect, useMemo, useRef, useState } from "react";
import ContentService from "~/services/ContentService";
import { StorageObjectType } from "~/models/Storage/StorageObjectType";

import { UncontrolledTreeEnvironment, Tree, TreeItem, TreeItemIndex } from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";
import { CustomDataProviderImplementation } from "./customDataProvider";

export type FileFromStorage = {
    name: string;
    isDirectory: boolean;
    type: StorageObjectType;
    parent: Node | null;
    url?: string,
    path?: string;
    updatedOn?: string;
    size?: number;
};

type Node = {

    index: string,
    isFolder: boolean,
    children: string[],
    data: FileFromStorage,

}

interface StoraExplorerConfig {
    allowUpload: boolean,
    onFileSelected?: (file: FileFromStorage) => void
}

export default function StorageExplorer({ allowUpload, onFileSelected }: StoraExplorerConfig) {

    const [selectedFile, setSelectedFile] = useState<FileFromStorage | null>(null)
    const [selectedFolder, setSelectedFolder] = useState<FileFromStorage | null>(null)
    const complexTreeRef = useRef(null)
    const fileInputRef = useRef(null)
    const service = new ContentService()

    const dataProvider = useMemo(
        () => {

            return new CustomDataProviderImplementation()
        },
        []
    );

    useEffect(() => {

        const loadBucket = async () => {
            const parent = (await dataProvider.getTreeItem('root'))
            const buckets = await service.Traverse()
            buckets.forEach(c => {

                const newNode = {
                    index: c.name,
                    isFolder: true,
                    children: [],
                    data: {
                        id: c.name,
                        name: c.name,
                        isDirectory: true,
                        path: "/",
                        type: StorageObjectType.bucket,
                        parent: null,

                    },
                }

                dataProvider.injectItem(parent, newNode)
            })

        }

        loadBucket()

    }, [])

    const openFileInput = () => {
        if (!selectedFolder || !fileInputRef?.current) return
        fileInputRef.current.click()
    }

    const loadImage = async (files: FileList | null) => {

        if (!files || !selectedFolder) return
        var file = files[0];


        var bucket = ""
        var path = ""
        var allParents: string[] = []

        if (selectedFolder.type == StorageObjectType.bucket) {

            bucket = selectedFolder.name
        } else {

            var current = selectedFolder

            while (current?.parent) {

                allParents.push(current.name)
                current = current?.parent.data

            }

            bucket = current?.name ?? ''

        }

        path = allParents.length > 0 ? allParents.reverse().join("/") : ''

        const result = await service.Upload(file, bucket, path, file?.name ?? 'no_name')

        if (result) {
            var parent = await dataProvider.getTreeItem(selectedFolder.name)
            dataProvider.injectItem(parent, result)
        }
    }

    const downloadFile = async () => {

        if (selectedFile && selectedFile.url && window) {
            //@ts-ignore
            window.open(selectedFile.url, '_blank').focus()

        }

    }

    const onSelectedFile = async (items: TreeItemIndex[], treeId: string) => {
        if (!items || items.length == 0) return

        var selected = items[0]

        if (!selected) return

        var node = await dataProvider.getTreeItem(selected)

        if (!node) return

        if (node.data.type != StorageObjectType.file) {
            setSelectedFolder(node.data);
        } else {
            setSelectedFile(node.data)
            setSelectedFolder(null);
        }

    }

    const OnFileSelectedToAdd = async () => {
        if(!selectedFile || !onFileSelected) return

        

        onFileSelected(selectedFile)
    }

    const fileSelected = async (item: TreeItem<FileFromStorage>, treeId: string) => {

        if (item && item.isFolder) {
            //its a bucket

            var bucket = ""
            var allParents: string[] = []

            if (item.data.type == StorageObjectType.bucket) {

                bucket = item.data.name
            } else {

                var current = item

                while (current?.data.parent) {

                    allParents.push(current.data.name)
                    current = current?.data.parent

                }

                bucket = current?.data.name ?? ''

            }

            var allParents = allParents.reverse()
            var _files = await service.Traverse(bucket, allParents)

            _files.forEach(c => {

                const isFolder = c.type == StorageObjectType.folder

                const newNode = {
                    index: c.name,
                    isFolder: isFolder,
                    children: [],
                    data: {
                        id: c.name,
                        name: c.name,
                        isDirectory: isFolder,
                        parent: item,
                        url: c.url,
                        type: c.type,
                        size: c.size,
                        updatedOn: c.updatedOn
                    },
                }

                dataProvider.injectItem(item, newNode)

            })
        }

    }



    return (
        <>
            <div className="grid grid-cols-[30%_70%] h-full">
                <div className="m-2 col-span-1">

                    <div>
                        <h1 className="font-extrabold">Storage</h1>
                    </div>
                    <div className="flex items-start">
                        <button onClick={downloadFile} disabled={!selectedFile} className="m-1 bg-gray-400">
                            <FontAwesomeIcon
                                icon={faDownload}
                                className="text-white w-4 h-4"
                            />

                        </button>
                        {
                            allowUpload ?
                                <div>
                                    <FontAwesomeIcon
                                        icon={faUpload}
                                        className="text-white w-4 h-4 m-1 bg-gray-400"
                                        onClick={openFileInput}
                                    />
                                    <input ref={fileInputRef} onChange={(e) => loadImage(e.target.files)}
                                        type="file" accept="image/*"
                                        disabled={!selectedFolder}
                                        className="hidden w-[0.1px] h-[0.1px]" />

                                </div> : null
                        }
                        {
                            onFileSelected ? <button onClick={OnFileSelectedToAdd} disabled={!selectedFile} className="m-1 bg-gray-400">
                            <FontAwesomeIcon
                                icon={faAdd}
                                className="text-white w-4 h-4"
                            />

                        </button>: null
                        }


                    </div>
                    <div className="">
                        <UncontrolledTreeEnvironment
                            ref={complexTreeRef}
                            onExpandItem={fileSelected}
                            onSelectItems={onSelectedFile}
                            dataProvider={dataProvider
                            }
                            getItemTitle={item => item.data.name}
                            viewState={{
                                'tree-2': {
                                    expandedItems: [],
                                },
                            }}
                        >
                            <Tree treeId="tree-1" rootItem="root" treeLabel="Files" />
                        </UncontrolledTreeEnvironment>
                    </div>


                </div>

                <div className="col-span-1 m-2">

                    {
                        selectedFile ?
                            <><div>
                                <h1 className="font-extrabold">Metadata</h1>
                            </div>
                                <div className="grid grid-cols-1 auto-rows-auto  w-full h-full m-4">

                                    <div className="row-span-1 max-h-[30%] h-fit" >

                                        <div className="grid float-right grid-cols-6 grid-rows-3 min-w-full">

                                            <div className="col-span-1 row-span-1">
                                                <label className="font-bold">Name</label>
                                            </div>

                                            <div className="col-span-5 row-span-1">
                                                <p className="break-words line-clamp-2">{selectedFile.name}</p>
                                            </div>

                                            <div className="col-span-1 row-span-1">
                                                <label className="font-bold">Updated on</label>
                                            </div>
                                            <div className="col-span-2 row-span-1">
                                                {selectedFile.updatedOn ? selectedFile.updatedOn : "-"}
                                            </div>

                                            <div className="col-span-1 row-span-1">
                                                <label className="font-bold">Size</label>
                                            </div>
                                            <div className="col-span-2 row-span-1">
                                                {selectedFile.size ? selectedFile.size : "-"}
                                            </div>


                                            <div className="col-span-1 row-span-1">
                                                <label className="font-bold">Url</label>
                                            </div>
                                            <div className="col-span-5 row-span-1 line-clamp-2">
                                                {selectedFile.url}
                                            </div>

                                        </div>
                                    </div>
                                    <div className="row-span-1">

                                        <h1 className="font-extrabold">Preview</h1>
                                        <div className="max-w-[30%] max-h-[30%]">
                                            <img className="object-contain" src={selectedFile?.url}></img>
                                        </div>

                                    </div>


                                </div></> : null
                    }




                </div>
            </div>


        </>
    );
}