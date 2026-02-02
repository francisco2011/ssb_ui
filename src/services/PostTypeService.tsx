import PostTypeModel from "~/models/PostTypeModel";
import FetchBase from "./FetchBase";

export default class PostTypeService extends FetchBase {

    BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

    async Get(): Promise<PostTypeModel[]> {

        var url = this.BACKEND_API_URL + "/postType";
        return this.GetBase(url)
    }
}