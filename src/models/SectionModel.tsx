import PaginationModel from "./PaginationModel";

export default interface SectionModel{

    id: number | null;
    name: string;
    content: string | null;
    tag: string | null;
    modifiable: boolean;
    _htmlContent: string 
}

export interface SectionModelResponse{

    sections: SectionModel[];
    pagination: PaginationModel;
    
}