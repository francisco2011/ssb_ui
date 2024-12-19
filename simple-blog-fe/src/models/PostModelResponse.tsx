import PostModel from "./PostModel";

export default interface PostModelResponse{

    posts: PostModel[];
    totalElements: number;
    
}