import { StorageObjectType } from "./StorageObjectType"

export interface StorageObjectModel {
        id: string
        name: string
        url: string
        type: StorageObjectType
}