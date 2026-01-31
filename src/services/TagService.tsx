import TagModel from "~/models/TagModel";
import TagUpdateModel from "~/models/TagUpdateModel";
import FetchBase from "./FetchBase";


export default class TagService extends FetchBase{

  async List(postTypeId: number): Promise<TagModel[]> {

    let url = 'http://localhost:5079/tags'

    url += '?postTypeId=' + postTypeId

    return await this.GetBase(url)
  }

  async updateTags(id: number, model: TagUpdateModel) {

    var url = "http://localhost:5079/tags/" + id;

    await this.PutBase<TagUpdateModel>(url, model)
  }
}

