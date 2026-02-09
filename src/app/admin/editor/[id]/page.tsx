'use client'

import React, { createRef, forwardRef, useEffect, useRef, useState } from 'react';

import PostModel from '~/models/PostModel';
import PostService from '~/services/PostService';
import { useParams } from 'next/navigation';
import Editor, { ContentState } from '~/components/admin/editor/Editor';
import ContentMetada from '~/models/ContentMetadata';
import VerticalToolbar from "~/components/admin/editor/VerticalToolbar";
import TagSelector from "~/components/admin/tagSelector/TagSelector";
import PostPreview from "~/components/admin/editor/PostPreview";
import TagService from "~/services/TagService";
import ImageInterface from "~/components/admin/editor/plugins/imagePlugin/ImageInterface";
import ContentService from "~/services/ContentService";
import ContentModel from "~/models/ContentModel";
import SectionService from "~/services/SectionService";
import SectionModel, { SectionModelResponse } from "~/models/SectionModel";
import { Toaster, toast } from 'sonner'
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSave } from '@fortawesome/free-solid-svg-icons';


export default function PostEditor() {

  const params = useParams<{ id: string; }>()
  const service = new PostService();
  const tagService = new TagService();
  const contentService = new ContentService()
  const sectionService = new SectionService()

  const [tags, setTags] = useState<string[]>([])
  const [post, setPost] = useState<PostModel | null>(null)
  const [metadata, setMetadata] = useState<ContentMetada>({
    isPublished: false,
    imgModel: null,
    type: null,
    name: null
  })
  const [isClearAll, setIsClearAll] = useState<boolean>(false);
  const titleEditorRef = useRef(null);
  const editorRef = useRef(null);
  const descriptionEditorRef = useRef(null);
  const router = useRouter()

  useEffect(() => {

    const getPost = async () => {

      if (post) return

      if (params?.id && params.id != 'none') {
        await service.Get(params.id)
          .then(data => {
            setPost(data);
            const metadata: ContentMetada = {
              isPublished: data.isPublished,
              imgModel: null,
              type: data.type,
              name: data.name
            }
            setMetadata(metadata)
            setTags(data.tags)
            toast.success('Post found!')
          })
          .catch(error => toast.error('Post not found!'))

      }
    }
    getPost()

  }, []);

  const updateMetadata = async (_metadata: ContentMetada) => {

    var isPublishedStateSame = metadata.isPublished == _metadata.isPublished
    setMetadata(_metadata)

    if (!isPublishedStateSame && post?.id) {
      await service.changePublishState(post?.id)
        .then(ok => {
          toast.success('Post updated!')
        })
        .catch(error => toast.error('Post not updated!'))
    }

  }

  const clearAll = () => {
    setIsClearAll(true)
  }

  const addTag = val => {
    //only done to generate a copy .... 
    var string_copy = (' ' + val).slice(1);

    if (tags.indexOf(string_copy) == -1) {
      setTags([...tags, string_copy])
    }
  }

  const deleteTag = val => {

    if (tags.indexOf(val) != -1) {
      setTags([...tags.filter(c => c != val)])

    }
  }

  const onSaveTags = async () => {

    if (!post || !post.id) return
    if (!editorRef?.current) return;

    var model = { tags: tags };

    await tagService.updateTags(post.id, model)
      .then(ok => toast.success('Tags saved!'))
      .catch(error => toast.error('Error tags not saved'))
  }


  const saveImgs = async (images: ImageInterface[], contentType: string): Promise<ContentModel[]> => {

    const result: ContentModel[] = []
    const imagesToSave = images.filter(c => c.src.startsWith("data:image"))
    try {

      for (var img of imagesToSave) {
        const newImg = await contentService.UploadFile(img.src, post?.id ?? 0, contentType);
        newImg.previousId = img.imgId
        result.push(newImg)
      }
    } catch (error) {
      toast.error('Error while saving images')
    }

    return result
  }

  const saveImgsWithUrl = async (images: ImageInterface[], contentType: string): Promise<ContentModel[]> => {
    const result: ContentModel[] = []

    const imagesToSaveWithUrl = images.filter(c => c.src.startsWith("http") && c.imgId)

    try {
      for (var img of imagesToSaveWithUrl) {
        const newImg = await contentService.UploadFileWithUrl(img.src, post?.id ?? 0, contentType, img.imgId ?? '');
        newImg.previousId = img.imgId
        result.push(newImg)
      }
    } catch (error) {
      toast.error('Error while saving images')
    }
    return result
  }

  const onsave = async () => {
    if (!post || !post.id) return
    if (!editorRef?.current || !titleEditorRef?.current) return;


    //@ts-ignore
    const titleEditorState = titleEditorRef.current.getState() as ContentState | null;

    //@ts-ignore
    const descriptionEditorState = descriptionEditorRef.current.getState() as ContentState | null;

    //@ts-ignore
    const images = editorRef.current.getAllImages() as ImageInterface[]
    var newImages = await saveImgs(images, "imgBody")

    if (metadata.imgModel && metadata.imgModel.src) {
      if(metadata.imgModel.src.startsWith('http')){
        await saveImgsWithUrl([{ src: metadata.imgModel.src, imgId: metadata.imgModel.name }], "preview")
      }else{
        await saveImgs([{ src: metadata.imgModel.src, imgId: metadata.imgModel.name }], "preview")
      } 

    }

    //@ts-ignore
    editorRef.current.UpdateImages(newImages)

    //@ts-ignore
    const editorState = editorRef.current.getState() as ContentState | null;

    if (!editorState) return

    post.content = editorState.Content
    post.contents = editorState.Imgs
    post.title = titleEditorState?.Content ?? ''
    post.description = descriptionEditorState?.Content ?? ''
    post.type = metadata.type
    post.name = metadata.name ?? ''

    ////////////////////////////

    /////Save HTML/////

    const html = await generateHtml()

    const htmlAsFile = contentService.htmltoFile(html, "render.html")
    await contentService.UploadFile(htmlAsFile, post.id, "render")
      .then(ok => toast.success('Render saved!'))
      .catch(error => toast.error('Error render not saved'))

    //@ts-ignore
    const titleHtml = titleEditorRef.current.toHtml()
    const titleHtmlFile = contentService.htmltoFile(titleHtml, "title.html")
    await contentService.UploadFile(titleHtmlFile, post.id, "titleRender")
      .then(ok => toast.success('Title render saved!'))
      .catch(error => toast.error('Error title render not saved'))

    //@ts-ignore
    const descriptionHtml = descriptionEditorRef.current.toHtml()
    const descriptionHtmlFile = contentService.htmltoFile(descriptionHtml, "description.html")
    await contentService.UploadFile(descriptionHtmlFile, post.id, "descriptionRender")
      .then(ok => toast.success('Description render saved!'))
      .catch(error => toast.error('Error description render not saved'))


    ///////////////////

    await service.Save(post)
      .then(result => {
        setPost({ ...post, id: result.id, content: post.content })
        toast.success('Post saved!')
      })
      .catch(error => toast.error('Error Post not saved'))

  }


  const loadSections = async (): Promise<SectionModelResponse> => {

    if (!editorRef || !titleEditorRef.current) throw new Error("Editor ref can not be null");

    //@ts-ignore
    var allSections = editorRef.current.getAllSections() as string[]

    var sections = (await sectionService.List(allSections.length, 0, allSections, true))
    return sections

  }


  const generateHtml = async (): Promise<string> => {
    if (!post) throw new Error("Post can not be null");
    if (!editorRef || !editorRef.current) throw new Error("Editor ref can not be null");
    if (!titleEditorRef || !titleEditorRef.current) throw new Error("titleEditorRef ref can not be null");
    if (!descriptionEditorRef || !descriptionEditorRef.current) throw new Error("titleEditorRef ref can not be null");

    const sections = await loadSections()

    //Needed because the state will change during this freaking operation :S
    //@ts-ignore
    editorRef.current.freezeState()

    //first lets replace default content

    const sectionTitle = sections.sections.find(c => c.tag == "{{title}}")
    const sectionDescription = sections.sections.find(c => c.tag == "{{description}}")

    if (sectionTitle) {
      // @ts-ignore
      var titleHtml = titleEditorRef.current.toHtml() as string
      sectionTitle.contentHtml = titleHtml
    }

    if (sectionDescription) {
      //@ts-ignore
      var descriptionHtml = descriptionEditorRef.current.toHtml() as string
      sectionDescription.contentHtml = descriptionHtml
    }

    //@ts-ignore
    editorRef.current.replaceContent(sections.sections.map(c => c.contentHtml),
      sections.sections.map(c => c.tag));

    ///replace content from external sections 


    //@ts-ignore
    const mainContentAsHtml = editorRef.current.toHtml()

    //@ts-ignore
    editorRef.current.restoreState()

    return mainContentAsHtml as string
  }



  async function goToPreview() {

    if (!post?.id) return

    router.push('/admin/preview/' + post?.id, undefined,)
  }

  return (
    <>


      {post ?

        <>

          <main className="flex min-h-screen flex-col">


            <div className="grid grid-cols-[75%_25%]">



              <div className=''>

                <div className='grid grid-cols-[85%_15%]'>
                  <h1 className='font-extrabold text-4xl'>{post.name}</h1>

                  <div className="flex justify-end">

                    <div className="m-1 tooltip tooltip-left" data-tip="preview">

                      <button
                        className={''}
                        onClick={() => {
                          goToPreview()
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faEye}
                          className="text-black w-8 h-8"
                        />
                      </button>

                    </div>
                    <div className="m-1 tooltip tooltip-left" data-tip="save">
                      <button
                        className=""
                        onClick={() => {

                          onsave()
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faSave}
                          className="text-black w-8 h-8"
                        />
                      </button>
                    </div>




                  </div>
                </div>

                <div className="collapse bg-base-200 my-1" >
                  <input type="checkbox" />
                  <div className="collapse-title text-l font-medium">Title</div>
                  <div className="collapse-content">
                    <Editor ref={titleEditorRef}
                      content={post.title ?? ''}
                      contents={[]}
                      onContentDeletedCallback={() => { }}
                      config={{ heightRem: '2rem', allowedToolBarOptions: { allowEmogis: true } }}></Editor>
                  </div>
                </div>
                <div className="collapse bg-base-200 my-1" >
                  <input type="checkbox" />
                  <div className="collapse-title text-l font-medium">Edit Description</div>
                  <div className="collapse-content">
                    <Editor ref={descriptionEditorRef}
                      content={post.description ?? ''}
                      contents={[]}
                      onContentDeletedCallback={() => { }}
                      config={{ heightRem: '5rem', allowedToolBarOptions: { allowEmogis: true } }}></Editor>
                  </div>
                </div>
                <div>
                  <Editor ref={editorRef}
                    content={post.content ?? ''}
                    contents={post.contents}
                    onContentDeletedCallback={clearAll}
                    config={{
                      heightRem: '100rem', allowedToolBarOptions: {
                        allowCode: true, allowColumn: true,
                        allowDiagram: true, allowEmogis: true,
                        allowGif: true, allowImages: true,
                        allowTable: true,
                        allowSection: true
                      }
                    }}></Editor>
                </div>

              </div>



              <div className='px-2 w-auto' >

                <div className='sticky top-3'>
                  <TagSelector externalValues={tags} isClean={isClearAll} onNewCallback={addTag} onDeletedCallBack={deleteTag} onSaveCallback={onSaveTags} />
                </div>


                <div className=' sticky top-32'>
                  <PostPreview post={post} onChange={updateMetadata} />
                </div>

              </div>
            </div>

          </main></>

        : null
      }


    </>
  );
}