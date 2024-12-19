import { number } from "zod";
import PostModel from "~/models/PostModel";
import PostModelResponse from "~/models/PostModelResponse";

export default class PostServiceSA {

  async Get(id: string): Promise<PostModel> {
    var url = "http://localhost:5079/post/" + id;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error(data.error)
      throw new Error("Error while loading data")
    }

    return data;
  }

  async List(limit: number, offset: number, typeId?: number, tags?: string[], published?: boolean): Promise<PostModelResponse> {

    var url = "http://localhost:5079/post?limit=" + limit + "&offset=" + offset;

    if (tags != undefined && tags.length > 0) {
      tags.forEach(c => {
        url += "&tags=" + c
      })
    }

    if (published) {
      url += "&published=" + published
    }

    if (typeId) {
      url += "&typeId=" + typeId
    }

    var response: Response | undefined = undefined;

    response = await fetch(url);

    const data = await response.json();
    
    if (data.error) {
      console.error(data.error)
      throw new Error("Error while loading data")
    }

    
    return data;
  }

  async Save(post: PostModel): Promise<PostModel> {

    var url = "http://localhost:5079/post";


    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(post),
      headers: new Headers({ 'content-type': 'application/json' }),
    });
    const data = await response.json();

    if (data.error) {
      console.error(data.error)
      throw new Error("Error while loading tags")
    }

    return data;
  }

  async changePublishState(id: number) {

    var url = "http://localhost:5079/post/" + id + "/changePublishState";

    const response = await fetch(url, {
      method: "PUT"
    });
    if (!response.ok) {
      throw new Error("Error while changing state")
    }
  }


}
