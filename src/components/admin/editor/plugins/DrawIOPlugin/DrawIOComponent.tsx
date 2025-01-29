//Base on: InlineImageComponent
import {$isDrawIOImageNode, type DrawIOImageNode, type Position} from './DrawIOImageNode';
import type {BaseSelection, LexicalEditor, NodeKey} from 'lexical';

import './DrawIOImageNode.css';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useLexicalEditable} from '@lexical/react/useLexicalEditable';
import {useLexicalNodeSelection} from '@lexical/react/useLexicalNodeSelection';
import {mergeRegister} from '@lexical/utils';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DRAGSTART_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import * as React from 'react';
import {Suspense, useCallback, useEffect, useRef, useState} from 'react';

import { DialogActions } from '~/components/Dialog';
import Button from '~/components/Button';
import useModal from '~/components/useModal';
import ImageResizer from '~/components/ImageResizer';
import { JSX } from 'react/jsx-runtime';
import EmbededDrawIOComponent from './EmbededDrawIOComponent';
import ContentService from '~/services/ContentService';
import ContentModel from '~/models/ContentModel';
import DrawIOResponse from './DrawIOResponse';
import { UPDATE_DRAW_IO_IMAGE_COMMAND } from '.';

const imageCache = new Set();

function useSuspenseImage(src: string) {
  if (!imageCache.has(src)) {
    throw new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
    });
  }
}

function LazyImage({
  altText,
  className,
  imageRef,
  src,
  width,
  height,
  position,
}: {
  altText: string;
  className: string | null;
  height: 'inherit' | number;
  imageRef: {current: null | HTMLImageElement};
  src: string;
  width: 'inherit' | number;
  position: Position;
}): JSX.Element {
  useSuspenseImage(src);
  return (
    <img
      className={className || undefined}
      src={src}
      alt={altText}
      ref={imageRef}
      data-position={position}
      style={{
        display: 'block',
        height,
        width
      }}
      draggable="false"
    />
  );
}


export function UpdateDrawIOImageDialog({
  activeEditor,
  nodeKey,
  onClose,
}: {
  activeEditor: LexicalEditor;
  nodeKey: NodeKey;
  onClose: () => void;
}): JSX.Element {
  const editorState = activeEditor.getEditorState();
  const node = editorState.read(
    () => $getNodeByKey(nodeKey) as DrawIOImageNode,
  );
  const [position, setPosition] = useState<Position>(node.getPosition());
  const [isSplitInHalves, setIsSplitInHalves] = useState(node.getIsSplitInHalves())

  const handleIsSplitInHalves = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSplitInHalves(e.target.checked);
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPosition(e.target.value as Position);
  };

  const handleOnConfirm = () => {
    const payload = {position, isSplitInHalves};
    if (node) {
      activeEditor.update(() => {
        node.update(payload);
      });
    }
    onClose();
  };

  return (
    <>
      <select
        style={{marginBottom: '1em', width: '208px'}}
        value={position}
        name="position"
        id="position-select"
        onChange={handlePositionChange}>
        <option value="left">Left</option>
        <option value="right">Right</option>
        <option value="full">Full Width</option>
      </select>

      <div className="Input__wrapper">
        <input
          id="halves"
          type="checkbox"
          checked={isSplitInHalves}
          onChange={handleIsSplitInHalves}
        />
        <label htmlFor="halves">Split in Halves</label>
      </div>

      <DialogActions >
        <Button
          data-test-id="image-modal-file-upload-btn"
          onClick={() => handleOnConfirm()}>
          Confirm
        </Button>
      </DialogActions>
    </>
  );
}

export default function DrawIOComponent({
  src,
  nodeKey,
  width,
  height,
  position,
  imgId
}: {
  height: 'inherit' | number;
  nodeKey: NodeKey;
  src: string;
  width: 'inherit' | number;
  position: Position;
  imgId?: string 
}): JSX.Element {
  const [modal, showModal] = useModal();
  const imageRef = useRef<null | HTMLImageElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState<BaseSelection | null>(null);
  const activeEditorRef = useRef<LexicalEditor | null>(null);
  const isEditable = useLexicalEditable();

  const [isResizing, setIsResizing] = useState<boolean>(false);

  const $onDelete = useCallback(
    (payload: KeyboardEvent) => {
      const deleteSelection = $getSelection();
      if (isSelected && $isNodeSelection(deleteSelection)) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        if (isSelected && $isNodeSelection(deleteSelection)) {
          deleteSelection.getNodes().forEach((node) => {
            if ($isDrawIOImageNode(node)) {
              node.remove();
            }
          });
        }
      }
      return false;
    },
    [isSelected],
  );

  const $onEnter = useCallback(
    (event: KeyboardEvent) => {
      const latestSelection = $getSelection();
      const buttonElem = buttonRef.current;
      if (
        isSelected &&
        $isNodeSelection(latestSelection) &&
        latestSelection.getNodes().length === 1
      ) {
        if (
          buttonElem !== null &&
          buttonElem !== document.activeElement
        ) {
          event.preventDefault();
          buttonElem.focus();
          return true;
        }
      }
      return false;
    },
    [isSelected],
  );

  const $onEscape = useCallback(
    (event: KeyboardEvent) => {
      if (
        buttonRef.current === event.target
      ) {
        $setSelection(null);
        editor.update(() => {
          setSelected(true);
          const parentRootElement = editor.getRootElement();
          if (parentRootElement !== null) {
            parentRootElement.focus();
          }
        });
        return true;
      }
      return false;
    },
    [editor, setSelected],
  );

  useEffect(() => {
    let isMounted = true;
    const unregister = mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        if (isMounted) {
          setSelection(editorState.read(() => $getSelection()));
        }
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor;
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload;
          if (event.target === imageRef.current) {
            if (event.shiftKey) {
              setSelected(!isSelected);
            } else {
              clearSelection();
              setSelected(true);
            }
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          if (event.target === imageRef.current) {
            // TODO This is just a temporary workaround for FF to behave like other browsers.
            // Ideally, this handles drag & drop too (and all browsers).
            event.preventDefault();
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        $onDelete,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        $onDelete,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(KEY_ENTER_COMMAND, $onEnter, COMMAND_PRIORITY_LOW),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        $onEscape,
        COMMAND_PRIORITY_LOW,
      ),
    );
    return () => {
      isMounted = false;
      unregister();
    };
  }, [
    clearSelection,
    editor,
    isSelected,
    nodeKey,
    $onDelete,
    $onEnter,
    $onEscape,
    setSelected,
  ]);

  /////////////////////////// RE SIZE /////////////////////////////

    const onResizeEnd = (
      nextWidth: 'inherit' | number,
      nextHeight: 'inherit' | number,
    ) => {
      // Delay hiding the resize bars for click case
      setTimeout(() => {
        setIsResizing(false);
      }, 200);
  
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isDrawIOImageNode(node)) {
          node.setWidthAndHeight(nextWidth, nextHeight);
        }
      });
    };
  
    const onResizeStart = () => {
      setIsResizing(true);
    };

  /////////////////////////////////////////////////////////////////

  ////////////////////TERRIBLE TERRIBLE IDEA///////////////////////

   const service = new ContentService()
  
      const loadImage = async (file: File | null) : Promise<ContentModel | null> => {
  
          if (file) {
              const result = await service.UpdateFileContent(file, 0, 'imgBody')
              return result
          }
  
          return null
  
      };


  const onDrawIOUpdate =  useCallback( async (data: DrawIOResponse | null) =>  {
      if(data){
          const img = await loadImage(data.Content)
          if(img && img.url){

              editor.dispatchCommand(UPDATE_DRAW_IO_IMAGE_COMMAND, {src: img.url, imgId: data?.ImageContext?.id});
          }
      }
  }, [editor])


  ////////////////////////////////////////////////////////////////

  const draggable = isSelected && $isNodeSelection(selection);
  const isFocused = isSelected && isEditable;
  return (
    <Suspense fallback={null}>
      <>
        <span draggable={draggable}>
          {isEditable && (
            <><button
                          className="image-config-button"
                          ref={buttonRef}
                          onClick={() => {
                              showModal('Update', (onClose) => (
                                  <UpdateDrawIOImageDialog
                                      activeEditor={editor}
                                      nodeKey={nodeKey}
                                      onClose={onClose} />
                              ));
                          } }>
                          Config
                      </button><button
                          className="drawio-image-edit-button"
                          ref={buttonRef}
                          onClick={() => {
                              showModal('Draw IO', (onClose) => (
                                  <EmbededDrawIOComponent
                                      onData={onDrawIOUpdate}
                                      imageContext={ { src: src, id: imgId }}
                                      onClose={onClose} />
                              ));
                          } }>
                              Edit
                          </button></>
          )}
          <LazyImage
            className={
              isFocused
                ? `focused ${$isNodeSelection(selection) ? 'draggable' : ''}`
                : null
            }
            src={src}
            altText={''}
            imageRef={imageRef}
            width={width}
            height={height}
            position={position}
          />
        </span>
        
        {$isNodeSelection(selection) && isFocused && (
                  <ImageResizer
                    showCaption={false}
                    setShowCaption={() => {}}
                    editor={editor}
                    buttonRef={buttonRef}
                    imageRef={imageRef}
                    onResizeStart={onResizeStart}
                    onResizeEnd={onResizeEnd}
                    captionsEnabled={false}
                  />
                )}
      </>
      {modal}
    </Suspense>
  );
}