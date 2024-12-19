import ImgModel from "./ImgModel";
import PostTypeModel from "./PostTypeModel";

export default interface ContentMetadaModel{

    title: string;
    description: string;
    imgModel: ImgModel | null;
    type: PostTypeModel | null;
        
}