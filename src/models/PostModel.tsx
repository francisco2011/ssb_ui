import ContentModel from "./ContentModel";
import PostTypeModel from "./PostTypeModel";

export default interface PostModel{

    id: number | null;
    title: string;
    description: string;
    content: string | null;
    createdAt: Date;
    isPublished: boolean;
    tags: string[];
    type: PostTypeModel | null
    contents: ContentModel[];
    _htmlContent?: any
    _contentWidth?: any
}
