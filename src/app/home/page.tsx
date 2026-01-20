import { ContentType } from "~/models/ContentType";
import ContentService from "~/services/ContentService";
import PostService from "~/services/PostService";

export default async function HomePage() {

  const service = new PostService()
  const contentSerice = new ContentService()
  let html = ''

  const about = await service.List(1, 0, 3, [], true, [ContentType.render]);

  if (about && about.posts.length > 0 && about.posts[0]?.contents
    && about.posts[0]?.contents.length > 0 && about.posts[0]?.contents[0]?.url) {

    html = await contentSerice.GetExternalContentAsStr(about.posts[0].contents[0].url)
  }


  return (

    <div id="parent" className="relative">
      <div className='editor-shell'>
        <div className="editor-container">

          <div className="content-center w-[50rem]">
               <div dangerouslySetInnerHTML={{ __html: html }}></div>
          </div>

         
        </div>
      </div>
    </div>
  );

}
