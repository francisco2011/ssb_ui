import { ContentType } from "./ContentType";

export default interface ContentModel{

    name: string | null;
    url: string | null;
    type: ContentType | string;
    //mimeType: string;
}

