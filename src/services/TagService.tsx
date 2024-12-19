import TagModel from "~/models/TagModel";


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
}

