import ContentModel from "./ContentModel";
import PostTypeModel from "./PostTypeModel";

export interface HtmlContent{
    value?: any,
    width?: any    
}


export default interface PostModel{

    id?: number;
    name: string;
    title: string;
    description: string;
    content: string | null;
    createdAt: Date;
    isPublished: boolean;
    tags: string[];
    type: PostTypeModel | null
    contents: ContentModel[];
    _contentHtml?:HtmlContent
    _titleHtml?: HtmlContent
    _descriptionHtml?: HtmlContent
}
