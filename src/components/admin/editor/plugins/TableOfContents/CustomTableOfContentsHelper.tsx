import { TableOfContentsEntry } from "./CustomTableOfContentsPlugin";
import { $isHeadingNode, HeadingNode, HeadingTagType } from '@lexical/rich-text';

type Node = {
    Entry: TableOfContentsEntry | null,
    Children: Node[]
    Prev: Node | null
    Li: HTMLLIElement | null
}

export default class CustomTableOfContentsHelper {

    toNumber(hTag: string) {
        return Number(hTag.replace("h", ''))
    }

    toTree(entries: TableOfContentsEntry[]): Node {

        var root: Node = { Entry: null, Children: [], Prev: null, Li: null }
        var lastAdded: Node = root

        if (entries.length == 0) return root

        for (var ent of entries) {

            if (!ent[2]) continue

            //maybe hn is at the level at which h2 should be
            if (!lastAdded.Prev) {
                var newNode: Node = { Entry: ent, Children: [], Prev: lastAdded, Li: null }
                lastAdded.Children.push(newNode)
                lastAdded = newNode
                continue
            }

            var asNum = this.toNumber(ent[2])
            var asNumPrev = this.toNumber(lastAdded.Entry?.[2])

            //then they are at the same level
            if (asNum == asNumPrev) {
                var newNode: Node = { Entry: ent, Children: [], Prev: lastAdded.Prev, Li: null }
                lastAdded.Prev.Children.push(newNode)
                lastAdded = newNode
            }

            //then new is a child
            if (asNum > asNumPrev) {
                var newNode: Node = { Entry: ent, Children: [], Prev: lastAdded, Li: null }
                lastAdded.Children.push(newNode)
                lastAdded = newNode
            }

            //must go up in the hierarchy
            //if lastAdded is 5 and new 3 then must search 2 
            if (asNum < asNumPrev) {

                var prev = lastAdded.Prev
                while (prev != null) {

                    //prev to the root
                    if (!prev.Prev) {
                        var newNode: Node = { Entry: ent, Children: [], Prev: prev, Li: null }
                        prev.Children.push(newNode)
                        lastAdded = newNode
                        break
                    }

                    asNumPrev = this.toNumber(prev.Entry?.[2])

                    //then they are at the same level
                    if (asNum == asNumPrev) {
                        var newNode: Node = { Entry: ent, Children: [], Prev: prev.Prev, Li: null }
                        prev.Prev.Children.push(newNode)
                        lastAdded = newNode
                        break
                    }

                    prev = prev.Prev
                }

            }

        }

        return root

    }
}