import ImgModel from "./ImgModel";
import PostTypeModel from "./PostTypeModel";

export default interface ContentMetadaModel{

    imgModel: ImgModel | null;
    type: PostTypeModel | null;
    isPublished: boolean;
}