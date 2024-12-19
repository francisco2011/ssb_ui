import PostTypeModel from "~/models/PostTypeModel";

export default class PostTypeService {

    async Get(): Promise<PostTypeModel[] | never> {

        var url = "http://localhost:5079/postType";

        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error(data.error)
            throw new Error("Error while loading tags")
        }

        return data;
    }
}