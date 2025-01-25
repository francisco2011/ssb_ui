import { DrawIOImageContext } from "./EmbededDrawIOComponent"

export default interface DrawIOResponse{
    Content: File
    Format: string
    ContentType: string
    ImageContext: DrawIOImageContext | null
}