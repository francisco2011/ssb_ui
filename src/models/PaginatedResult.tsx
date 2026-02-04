import PaginationModel from "./PaginationModel";

export default interface PaginatedResult<T>{

    data: T[];
    pagination: PaginationModel;
    
}