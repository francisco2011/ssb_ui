import { error } from "console";
import { notFound } from "next/navigation";
import { ContentType } from "~/models/ContentType";
import PostModel from "~/models/PostModel";
import PostModelResponse from "~/models/PostModelResponse";
import FetchBase from "./FetchBase";

export default class PostService extends FetchBase {

  async Get(id: string): Promise<PostModel> {

    var url = "http://localhost:5079/post/" + id;
    return this.GetBase(url) 
  }

  async Clone(id: number): Promise<number> {
    var url = "http://localhost:5079/post/" + id + "/clone";

    return this.PostBase<Number, number>(id, url);
  }

  async Delete(id: number) {
    var url = "http://localhost:5079/post/" + id;

    return this.DeleteBase(url)


  }

  async List(limit: number, offset: number, typeId?: number, tags?: string[], published?: boolean, contents?: ContentType[]): Promise<PostModelResponse> {

    var url = "http://localhost:5079/post?limit=" + limit + "&offset=" + offset;

    if (tags != undefined && tags.length > 0) {
      tags.forEach(c => {
        url += "&tags=" + c
      })
    }

    if (published) {
      url += "&published=" + published
    }

    if (contents) {

      contents.forEach(c => {
        url += "&contents=" + c.toString()
      })
    }

    if (typeId) {
      url += "&typeId=" + typeId
    }

    return this.GetBase(url)

  }

  async Save(post: PostModel): Promise<PostModel> {

    var url = "http://localhost:5079/post";
    return await this.PostBase<PostModel, PostModel>(post, url)
  }



  async changePublishState(id: number) {

    var url = "http://localhost:5079/post/" + id + "/changePublishState";

    return this.PutBase(url, undefined)
  }


}
