'use client'

import { useEffect, useState } from "react";
import ContentService from "~/services/ContentService";
import { StorageObjectType } from "~/models/Storage/StorageObjectType";

import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider, TreeItem } from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';

type File = {
    name: string;
    isDirectory: boolean;
    type: StorageObjectType;
    parent: Node | null;
    path?: string;
    updatedAt?: string;
    size?: number;
};

type Node = {

    index: string,
    isFolder: boolean,
    children: string[],
    data: File,

}

type Tree = {

}

export default function Files() {

    const [treeData, setTreeData] = useState({
        root: {
            index: 'root',
            isFolder: true,
            children: [],
            data: 'Root item',
        }
    });

    const service = new ContentService()


    useEffect(() => {

        const loadBucket = async () => {
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

                if(!treeData[c.name]) treeData[c.name] = newNode
                treeData.root.children.push(c.name)

            })

            setTreeData(treeData)
        }

        loadBucket()

    }, [])

    const fileSelected = async (item: TreeItem<File>, treeId: string) => {

        if (item && item.isFolder) {
            //its a bucket

            var bucket = ""
            var allParents: string[] = []

            if (item.data.type == StorageObjectType.bucket) {

                bucket = item.data.name
            } else {
                
                var current = item
                
                while(current?.data.parent){

                    allParents.push(current.data.name)    
                    current = current?.data.parent
                    
                }

                bucket = current?.data.name??''
                
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
                        type: c.type
                    },
                }
                if(!treeData[c.name]){
                    treeData[c.name] = newNode
                    treeData[item.index].children.push(c.name)
                } 

            })

            setTreeData({...treeData})
        }

    }

    return (
        <>
            <div className="grid grid-rows-2">
                <div className="grid-cols-1">

                    <UncontrolledTreeEnvironment
                        onExpandItem={fileSelected}
                        dataProvider={
                            new StaticTreeDataProvider(treeData, (item, data) => ({ ...item, data }))
                        }
                        getItemTitle={item => item.data.name}
                        viewState={{}}
                    >
                        <Tree treeId="tree-1" rootItem="root" treeLabel="Files" />
                    </UncontrolledTreeEnvironment>

                </div>

                <div className="grid-cols-1">

                </div>
            </div>
        </>
    );
}