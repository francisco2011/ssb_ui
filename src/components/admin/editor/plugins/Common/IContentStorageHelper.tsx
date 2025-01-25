import ContentModel from "~/models/ContentModel";

export default interface IContentStorageHelper { 

    store(file: File): Promise<ContentModel>;
    updateContent(file: File, fileName: string): Promise<ContentModel>;

}