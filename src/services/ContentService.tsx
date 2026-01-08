import ContentModel from "~/models/ContentModel";

export default class ContentService {


    dataURLtoBlob(dataurl: string, fileName: string ): File | null {

        if(!dataurl) throw new Error("dataurl cant be empty, undefined or null")

        var arr = dataurl.split(',') 
        
        if(!arr || arr.length < 2) throw new Error("dataurl is not well formated")
        
        //@ts-ignore
        var mime = arr[0].match(/:(.*?);/)[1];

        //@ts-ignore
        var  bstr = atob(arr[1]) 
        var n = bstr.length 
        var u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([new Blob([u8arr], {type:mime})], fileName) ;
    }

    async UploadFile(file: File|string, postId: number, contentType: string ): Promise<ContentModel> {

        if( typeof file === 'string'){

            const newFile = this.dataURLtoBlob(file, "no_name")

            if(newFile) file = newFile
         }

        var url = 'http://localhost:5079/post/' + postId + '/contentType/' + contentType;

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();

        if (data.error) {
            console.error(data.error)
            throw new Error("Error while loading data")
        }

        return data;
    }

    async UpdateFileContent(file: any, postId: number, fileName: string ): Promise<ContentModel> {
        var url = 'http://localhost:5079/post/' + postId + '/content/' + fileName;

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(url, {
            method: "PUT",
            body: formData,
        });
        const data = await response.json();

        if (data.error) {
            console.error(data.error)
            throw new Error("Error while loading data")
        }

        return data;
    }

    async GetDownloadUrl(fileName: string): Promise<ContentModel> {
        var url = "http://localhost:5079/content/" + fileName;

        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error(data.error)
            throw new Error("Error while loading data")
        }

        return data;
    }





}
