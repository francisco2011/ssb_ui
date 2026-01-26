import { StorageObjectType } from "./StorageObjectType"

export interface StorageObjectModel {
        id: string
        name: string
        url: string
        type: StorageObjectType
        updatedOn?: string;
        size?: number;
        mimeType: string
}