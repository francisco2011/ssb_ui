import React from 'react';
import PostService from '~/services/PostService';
import { notFound } from 'next/navigation';
import ContentService from '~/services/ContentService';
import { NextRequest } from 'next/server';

export  default async function Post(request: NextRequest) {

  //@ts-ignore
  const id = (await request.params).id
  const service = new PostService();
  const contentService = new ContentService();
  let htmlContent = ""

  const getPost = async () => {

      if(id){
        const p = await service.Get(id)

        if(!p) notFound()
        
        const render = p.contents.find(c => c.type == "render")

        //TODO: ONLY HTML WILL BE ALLOWED
        if(render && render.url){
          const _htmlContent = await contentService.GetExternalContentAsStr(render.url)
          
          htmlContent = _htmlContent
          //setHtmlContent(htmlContent)
        }

      }
    }
    await getPost()

  return (
    <>

    {
        <div className='editor-shell' >
          <div className='editor-container' >
            <div >
              <div className=''  dangerouslySetInnerHTML={{ __html: htmlContent }}>

              </div>
            </div>
        </div>
        </div>
    }
    
    </>
  );
}