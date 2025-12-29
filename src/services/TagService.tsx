import TagModel from "~/models/TagModel";
import TagUpdateModel from "~/models/TagUpdateModel";


export default class TagService{

    async List(postTypeId?: number): Promise<TagModel[]> {

      let url = 'http://localhost:5079/tags'

      if(postTypeId){
        url += '?postTypeId=' + postTypeId
      }

      const response = await fetch(url);

      const data = await response.json();

        if (data.error) {
            console.error(data.error)
            throw new Error("Error while loading tags")
          }
        
        return data;
      }

      async updateTags(id: number, model: TagUpdateModel) {

        var url = "http://localhost:5079/tags/" + id;
    
        const response = await fetch(url, {
          method: "PUT",
          body: JSON.stringify(model),
          headers: new Headers({ 'content-type': 'application/json' }),
        });
        if (!response.ok) {
          throw new Error("Error while changing state")
        }
      }
}

