import PostModel from "~/models/PostModel";
import PostModelResponse from "~/models/PostModelResponse";
import SectionModel, { SectionModelResponse } from "~/models/SectionModel";

export default class SectionService {

  async Get(id: string): Promise<SectionModel> {
    var url = "http://localhost:5079/section/" + id;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error(data.error)
      throw new Error("Error while loading data")
    }

    return data;
  }

 
  async Save(model: SectionModel): Promise<SectionModel> {

    var url = "http://localhost:5079/section";


    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(model),
      headers: new Headers({ 'content-type': 'application/json' }),
    });
    const data = await response.json();

    if (data.error) {
      console.error(data.error)
      throw new Error("Error while loading tags")
    }

    return data;
  }

  async Update(id: number, model: SectionModel) {

    var url = "http://localhost:5079/section/" + id;

    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(model),
      headers: new Headers({ 'content-type': 'application/json' })
    });
    if (!response.ok) {
      throw new Error("Error while changing state")
    }
  }

  async List(limit: number, offset: number, tags?: string[], includeContent?: boolean): Promise<SectionModelResponse> {
  
      var url = "http://localhost:5079/section?limit=" + limit + "&offset=" + offset;

      if(tags && tags.length > 0){

        tags.forEach(c => {
          url += "&tags=" + c
        })

      } 

      if(includeContent){
        url += "&includeContent=" + includeContent
      }

      var response: Response = await fetch(url);
      
      const data = await response.json();
      
      if (data.error) {
        console.error(data.error)
        throw new Error("Error while loading data")
      }
  
      
      return data;
    }

    async Delete(id: number){
      var url = "http://localhost:5079/section/" + id;
  
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


}
