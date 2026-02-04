import PostTypeModel from "~/models/PostTypeModel";
import FetchBase from "./FetchBase";
import PaginatedResult from "~/models/PaginatedResult";

export default class PostTypeService extends FetchBase {

    BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

    async Get(limit: number, offset: number): Promise<PaginatedResult<PostTypeModel>> {

        var url = this.BACKEND_API_URL + "/postType?limit=" + limit + "&offset=" + offset
        return this.GetBase(url)
    }
}