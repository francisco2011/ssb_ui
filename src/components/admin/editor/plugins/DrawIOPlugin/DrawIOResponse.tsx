import { DrawIOImageContext } from "./EmbededDrawIOComponent"

export default interface DrawIOResponse{
    Content: File | string
    Format: string
    ContentType: string
    ImageContext: DrawIOImageContext | null
}