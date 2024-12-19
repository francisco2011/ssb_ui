export default interface PaginationModel
{
    totalCount: number // total elements
    pageCount: number // total pages
    pageSize: number // elements per page
    page: number // current page
}