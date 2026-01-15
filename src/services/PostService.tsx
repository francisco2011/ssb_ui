import PostModel from "~/models/PostModel";
import PostModelResponse from "~/models/PostModelResponse";

export default class PostService {

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

  async Clone(id: number): Promise<number> {
    var url = "http://localhost:5079/post/" + id +"/clone"; 


    const response = await fetch(url, {
      method: "POST",
      headers: new Headers({ 'content-type': 'application/json' }),
    });
    const data = await response.json();

    if (data.error) {
      console.error(data.error)
      throw new Error("Error while loading tags")
    }
    return data as number;
  }

  async Delete(id: number){
    var url = "http://localhost:5079/post/" + id;

    const response = await fetch(url, {
      method: "DELETE",
      headers: new Headers({ 'content-type': 'application/json' }),
    });


    if (response.status != 204) {

      var error = await response.text();

      console.error('Fetch error:', error);
      throw error;
    }


  }

  async List(limit: number, offset: number, typeId?: number, tags?: string[], published?: boolean, loadContent?: boolean): Promise<PostModelResponse> {

    var url = "http://localhost:5079/post?limit="+ limit + "&offset=" + offset;

    if (tags != undefined && tags.length > 0) {
      tags.forEach(c => {
        url += "&tags=" + c
      })
    }

    if(published){
      url += "&published=" + published
    }

    if (loadContent) {
      url += "&loadContent=" + loadContent
    }

    if(typeId){
      url += "&typeId=" + typeId
    }

    const response = await fetch(url);
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
