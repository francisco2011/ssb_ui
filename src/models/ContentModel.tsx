import { ContentType } from "./ContentType";

export default interface ContentModel{

    name: string | null;
    url: string | null;
    type: ContentType | string;
    previousId: string | undefined

}

