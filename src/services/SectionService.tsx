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

  async List(limit: number, offset: number): Promise<SectionModelResponse> {
  
      var url = "http://localhost:5079/section?limit=" + limit + "&offset=" + offset;

      var response: Response | undefined = undefined;
  
      response = await fetch(url);
  
      const data = await response.json();
      
      if (data.error) {
        console.error(data.error)
        throw new Error("Error while loading data")
      }
  
      
      return data;
    }


}
