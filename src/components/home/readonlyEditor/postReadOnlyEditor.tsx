'use client'

import React, { createRef, forwardRef, useEffect, useRef, useState } from 'react';
import ReadonlyEditor from './readonlyEditor';
import EditorTheme from '~/themes/EditorTheme';


export default function PostReadonlyEditor({ content, contents  }) {


  return (
    <>
      <ReadonlyEditor onHtmlGenerated={() => {}} content={content} contents={contents} contentClassName="editor-article" shellClassName="editor-scroller-article" editorTheme={EditorTheme}/>

    </>
  );
}