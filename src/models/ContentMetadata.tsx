import ImgModel from "./ImgModel";
import PostTypeModel from "./PostTypeModel";

export default interface ContentMetadaModel{

    name: string | null;
    imgModel: ImgModel | null;
    type: PostTypeModel | null;
    isPublished: boolean;
}