import ContentModel from "~/models/ContentModel";
import IContentStorageHelper from "./IContentStorageHelper";
import ContentService from "~/services/ContentService";

export default class ContentStorageHelper implements IContentStorageHelper {

    service = new ContentService()
    postId: number;

    constructor(_postId: number) {
        this.postId = _postId;
    }

    async updateContent(file: File, imgId: string): Promise<ContentModel> {


        if (file && this.postId) {
            const result = await this.service.UpdateFileContent(file, this.postId, imgId)
            return result
        }

        throw new Error("file and or postId can not be null or undefined");
    }

    async store(file: File): Promise<ContentModel> {


        if (file && this.postId) {
            const result = await this.service.UploadFile(file, this.postId, 'imgBody')
            return result
        }

        throw new Error("file and or postId can not be null or undefined");
    }
}