import ContentModel from "~/models/ContentModel";

export default class ContentService {

    async UploadFile(file: any, postId: number, contentType: string ): Promise<ContentModel> {
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
