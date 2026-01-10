'use client'

import React, { createRef, forwardRef, useEffect, useRef, useState } from 'react';
import ReadonlyEditor from './readonlyEditor';
import EditorTheme from '~/themes/EditorTheme';


export default function PostReadonlyEditor({ post  }) {


  return (
    <>
      <ReadonlyEditor post={post} contentClassName="editor-article" shellClassName="editor-scroller-article" editorTheme={EditorTheme}/>

    </>
  );
}