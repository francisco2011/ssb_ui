import { ElementNode } from "lexical";
import { $createMyDivNode } from "../plugins/Div/DivNode";
import SectionGeneratorInterface from "./SectionGeneratorInterface";

export default class TagSectionGenerator implements SectionGeneratorInterface {

    __tags: string[]

    constructor(tags: string[]) {
        this.__tags = tags
    }

    execute(): ElementNode {
        var mainDiv = $createMyDivNode('flex gap-3 my-4 md:my-12 flex-wrap px-4', '')

        this.__tags.forEach(c => { mainDiv.append($createMyDivNode("text-md x:text-xs xs:text-xs sm:text-xs px-2 py-1 relative text-gray-500 bg-gray-100 rounded-badge hover:shadow shadow-teal-700  border border-gray-800", c)) })

        return mainDiv
    }

}
