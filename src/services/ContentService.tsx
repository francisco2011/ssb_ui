import ContentModel from "~/models/ContentModel";
import { StorageObjectModel } from "~/models/Storage/StorageObjectModel";
import FetchBase from "./FetchBase";

export default class ContentService extends FetchBase {

    BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

    dataURLtoBlob(dataurl: string, fileName: string): File | null {

        if (!dataurl) throw new Error("dataurl cant be empty, undefined or null")

        var arr = dataurl.split(',')

        if (!arr || arr.length < 2) throw new Error("dataurl is not well formated")

        //@ts-ignore
        var mime = arr[0].match(/:(.*?);/)[1];

        //@ts-ignore
        var bstr = atob(arr[1])
        var n = bstr.length
        var u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([new Blob([u8arr], { type: mime })], fileName);
    }

    htmltoFile(htmlString: string, fileName: string): File {

        if (!htmlString) throw new Error("dataurl cant be empty, undefined or null")

        const blob = new Blob([htmlString], { type: 'text/html' });

        return new File([blob], fileName);
    }

    async UploadFileWithUrl(fileUrl: string, postId: number, contentType, fileName: string): Promise<ContentModel>{
        var url = this.BACKEND_API_URL + '/post/' + postId + '/content/'

        const model: ContentModel = {
            name: fileName,
            type: contentType,
            url: fileUrl
        }

        return this.PostBase<ContentModel, ContentModel>(model, url, { ContentType: "application/json"})
    }

    async UploadFile(file: File | string, postId: number, contentType: string): Promise<ContentModel> {

        if (typeof file === 'string') {

            const newFile = this.dataURLtoBlob(file, "no_name")

            if (newFile) file = newFile
        }

        var url = this.BACKEND_API_URL + '/post/' + postId + '/contentType/' + contentType;

        const formData = new FormData();
        formData.append("file", file);
        return this.PostBase<FormData, ContentModel>(formData, url, undefined)
    }

    async UpdateFileContent(file: any, postId: number, fileName: string): Promise<ContentModel> {
        var url = this.BACKEND_API_URL + '/post/' + postId + '/content/' + fileName;

        const formData = new FormData();
        formData.append("file", file);


        return this.PutBase<FormData, ContentModel>(url, formData, undefined)

    }

    async Upload(file: any, bucket: string, path: string, fileName: string): Promise<StorageObjectModel> {
        var url = this.BACKEND_API_URL + '/content/bucket/' + bucket + "/" + fileName;

        if(path){
            url += "?path=" + path
        }

        const formData = new FormData();
        formData.append("file", file);

        return this.PostBase<FormData, StorageObjectModel>(formData,url, undefined)

    }


    async GetDownloadUrl(fileName: string): Promise<ContentModel> {
        var url = this.BACKEND_API_URL + "/content/" + fileName;

        return this.GetBase(url)
    }

    async GetExternalContentAsStr(url: string): Promise<String> {
        return this.GetBaseRawResult(url)
    }

    async Traverse(bucket?: string, folders?: string[]): Promise<StorageObjectModel[]> {
        var url = this.BACKEND_API_URL + "/content/storage/traverse?";

        if (folders && folders.length > 0) {
            folders.forEach(c => {
                url += "&folders=" + c
            })
        }

        if (bucket) {
            url += "&bucket=" + bucket
        }

        return this.GetBase(url)
    }
}
