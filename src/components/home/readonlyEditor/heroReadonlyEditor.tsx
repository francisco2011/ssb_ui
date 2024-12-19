'use client'

import React, { createRef, forwardRef, useEffect, useRef, useState } from 'react';
import ReadonlyEditor from './readonlyEditor';
import HeroEditorTheme from '~/themes/HeroEditorTheme';


export default function HeroReadonlyEditor({ content, contents, onHtmlGenerated  }) {


  return (
    <>
      <ReadonlyEditor onHtmlGenerated={onHtmlGenerated} content={content} contents={contents} contentClassName="editor-hero" shellClassName="" editorTheme={HeroEditorTheme}/>

    </>
  );
}