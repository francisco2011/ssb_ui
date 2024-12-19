import { useCallback, useEffect, useState } from "react";
import PaginationModel from "~/models/PaginationModel";

type Props = {
    model: PaginationModel,
    onPageSelected: (pageSize: number) => void,
    onPageSizeChanged: (pageSize: number) => void
}

type PageModel = {
    value: number
}

export default function CustomPaginator({ model, onPageSelected, onPageSizeChanged }: Props): JSX.Element {

    const [pages, setPages] = useState<PageModel[]>([])
    const [selectedPageSize, setSelectedPageSize] = useState<number>(model.pageSize)
    const [selectedPage, setSelectedPage] = useState<number>(model.pageSize)
    const pageSizes = [2, 4, 5, 8, 10]

    useEffect(() => {

        const allPages: PageModel[] = []
        for (let index = 0; index < model.pageCount; index++) {

            allPages.push({ value: index + 1 })
        }

        setPages(allPages)
        setSelectedPageSize(model.pageSize)

    }, [model]);

    const _onPageSizeSelected = (page: number) => {
        setSelectedPageSize(page)
        onPageSizeChanged(page)
        
    }
    
    const _onPageSelected = (page: PageModel) => {
        setSelectedPage(page.value)
        onPageSelected(page.value)
        
    }

    return (
        <>

            <div className="flex flex-row">
                <div className="join">

                    {
                        pages.map(c => c.value == selectedPage ? <button key={c.value} className="join-item btn btn-active" onClick={() => _onPageSelected(c)}>{c.value}</button> 
                        : 
                        <button key={c.value} onClick={() => _onPageSelected(c)} className="join-item btn">{c.value}</button>)
                    }

                </div>

                <div className="mr-2 ml-2">
                    <select onChange={(e) => _onPageSizeSelected(Number(e.target.value))} value={selectedPageSize} className="select select-md select-bordered">
                        {
                            pageSizes.map(c => <option key={c}>{c}</option>)
                        }

                    </select>
                </div>
            </div>





        </>

    );

}