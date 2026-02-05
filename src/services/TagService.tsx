import TagModel from "~/models/TagModel";
import TagUpdateModel from "~/models/TagUpdateModel";
import FetchBase from "./FetchBase";


export default class TagService extends FetchBase{

  BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

  async List(postTypeId: number): Promise<TagModel[]> {

    let url = this.BACKEND_API_URL + '/tags'

    url += '?postTypeId=' + postTypeId

    return this.GetBase(url)
  }

  async updateTags(id: number, model: TagUpdateModel) {

    var url = this.BACKEND_API_URL + "/tags/" + id;

    await this.PutBaseNoResult<TagUpdateModel>(url, model, {ContentType: "application/json"})
  }
}

