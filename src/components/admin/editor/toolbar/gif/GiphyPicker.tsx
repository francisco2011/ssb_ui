
import { Carousel, Grid, SearchBar, SearchContext, SearchContextManager } from '@giphy/react-components'
import { GiphyFetch, MediaType } from '@giphy/js-fetch-api'
import { IGif, IUser, GifID, IChannel } from '@giphy/js-types';
import { SyntheticEvent, useContext, useEffect, useRef, useState } from 'react';

export type Gif = {
    url: string,
    description: string
}

export interface PickerConfig {
    OnGifSelected: (gif: Gif) => void
}

export default function GiphyPicker({ OnGifSelected }: PickerConfig) {

    const [searchTerm, setSearchTerm] = useState('')
    const [gType, setgType] = useState<MediaType>('gifs')
    const [clearInput, setClearInput] = useState(false)
    const scrollRef = useRef(null);
    const gridRef = useRef<Grid>(null)
    const { fetchGifs, searchKey } = useContext(SearchContext)

    const G_API_KEY = process.env.NEXT_PUBLIC_GIF_API_KEY
    const gf = new GiphyFetch(G_API_KEY)

    //type MediaType = 'stickers' | 'gifs' | 'text' | 'videos';
    const _fetchGifs = (offset: number) => { return gf.search(searchTerm, { offset, limit: 10, type: gType }) }

    function onClick(gif: IGif, e: SyntheticEvent<HTMLElement, Event>) {
        e.preventDefault()
        OnGifSelected({ url: gif.images.original.url, description: gif.alt_text ?? '' })
    }

    function onSearchEnter(term: string) {
        setSearchTerm(term)
        setClearInput(false)
    }

    const setGType = (e: any) => {
        setgType(e.target.value)
        if(gridRef.current){
            setSearchTerm('')
            setClearInput(true)
            gridRef.current.forceUpdate()
        }
        
    }

    return (
        <>
            <select value={gType} onChange={setGType}>
                <option value="stickers">stickers</option>
                <option value="gifs">gifs</option>
                <option value="text">text</option>
                <option value="videos">videos</option>
                </select>
            <SearchBar  onEnter={onSearchEnter} autoFocus={true} clear={clearInput} />
            <div       ref={scrollRef}
                        style={{ height: '20rem', overflowY: 'auto' }} >
                <Grid ref={gridRef} columns={3} width={400}  initialGifs={[]} key={searchTerm} gutter={2} fetchGifs={_fetchGifs} onGifClick={onClick} />
            </div>
        </>
    )

}