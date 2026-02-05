import PostTypeModel from "~/models/PostTypeModel";
import FetchBase from "./FetchBase";
import PaginatedResult from "~/models/PaginatedResult";

export default class PostTypeService extends FetchBase {

    BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

    async Get(limit: number, offset: number): Promise<PaginatedResult<PostTypeModel>> {

        var url = this.BACKEND_API_URL + "/postType?limit=" + limit + "&offset=" + offset
        return await this.GetBase(url)
    }

    async GetBy(id: number): Promise<PostTypeModel> {

        var url = this.BACKEND_API_URL + "/postType/"+id
        return await this.GetBase<PostTypeModel>(url)
    }

    async Save(model: PostTypeModel):Promise<PostTypeModel>{
        var url = this.BACKEND_API_URL + "/postType"
        return await this.PostBase<PostTypeModel, PostTypeModel>(model, url, { ContentType: "application/json" })
    }

    async Update(model: PostTypeModel){
        var url = this.BACKEND_API_URL + "/postType/" + model.id
        await this.PutBaseNoResult<PostTypeModel>(url, model, { ContentType: "application/json" })
    }
}