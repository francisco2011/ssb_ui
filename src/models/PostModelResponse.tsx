import PaginationModel from "./PaginationModel";
import PostModel from "./PostModel";

export default interface PostModelResponse{

    posts: PostModel[];
    pagination: PaginationModel;
    
}