import SectionModel, { SectionModelResponse } from "~/models/SectionModel";
import FetchBase from "./FetchBase";

export default class SectionService extends FetchBase{

  BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

  async Get(id: string): Promise<SectionModel> {
    var url = this.BACKEND_API_URL + "/section/" + id;
    return this.GetBase(url)
  }

 
  async Save(model: SectionModel): Promise<SectionModel> {

    var url = this.BACKEND_API_URL + "/section";

    return this.PostBase<SectionModel, SectionModel>(model, url, { ContentType: "application/json"})

  }

  async Update(id: number, model: SectionModel) {

    var url = this.BACKEND_API_URL + "/section/" + id;

    return this.PutBase<SectionModel, SectionModel>(url, model, { ContentType: "application/json"})
  }

  async List(limit: number, offset: number, tags?: string[], includeContent?: boolean): Promise<SectionModelResponse> {
  
      var url = this.BACKEND_API_URL + "/section?limit=" + limit + "&offset=" + offset;

      if(tags && tags.length > 0){

        tags.forEach(c => {
          url += "&tags=" + c
        })

      } 

      if(includeContent){
        url += "&includeContent=" + includeContent
      }

      return this.GetBase(url)
    }

    async Delete(id: number){
      var url = this.BACKEND_API_URL + "/section/" + id;
  
      this.DeleteBase(url)
  
  
    }


}
