'use client'

import React, { createRef, forwardRef, useEffect, useRef, useState } from 'react';
import PostModel from '~/models/PostModel';
import PostService from '~/services/PostService';
import { useParams, useSearchParams } from 'next/navigation';
import PostReadonlyEditor from '~/components/home/readonlyEditor/postReadOnlyEditor';
import ContentService from '~/services/ContentService';

export default function PostEditor() {

  const params = useParams<{ id: string; }>()
  const service = new PostService();
  const contentService = new ContentService();

  const [post, setPost] = useState<PostModel | null> (null)
  const [htmlContent, setHtmlContent] = useState<string | null> (null)

  useEffect(() => {
    
    const getPost = async () => {

      if(params?.id && params.id != 'none'){
        const p = await service.Get(params.id)
        
        const render = p.contents.find(c => c.type == "render")

        //TODO: ONLY HTML WILL BE ALLOWED
        if(render && render.url){
          const htmlContent = await contentService.GetExternalContentAsStr(render.url)
          setHtmlContent(htmlContent)
        }else{
          setPost(p)
        }

      }
    }
    getPost()
    
  }, []);

  return (
    <>

    {
        post ? <PostReadonlyEditor post={post} /> : null
    }

    {
        htmlContent ? <div className='editor-shell' >
          <div className='editor-container' >
            <div >
              <div className=''  dangerouslySetInnerHTML={{ __html: htmlContent }}>

              </div>
            </div>
        </div>
        </div> : null
    }
    
    </>
  );
}