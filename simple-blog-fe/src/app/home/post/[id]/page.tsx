'use client'

import React, { createRef, forwardRef, useEffect, useRef, useState } from 'react';
import PostModel from '~/models/PostModel';
import PostService from '~/services/PostService';
import { useParams, useSearchParams } from 'next/navigation';
import PostReadonlyEditor from '~/components/home/readonlyEditor/postReadOnlyEditor';

export default function PostEditor() {

  const params = useParams<{ id: string; }>()
  const service = new PostService();

  const [post, setPost] = useState<PostModel | null> (null)

  useEffect(() => {
    
    const getPost = async () => {

      if(params?.id && params.id != 'none'){
        const p = await service.Get(params.id)
        
        setPost(p)
  
      }
    }
    getPost()
    
  }, []);

  return (
    <>

    {
        post ? <PostReadonlyEditor content={post.content} contents={post.contents} /> : null
    }
    
    </>
  );
}