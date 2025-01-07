import {
        HeadingTagType
} from "@lexical/rich-text";

export default class FormatContainer {
        public IsBold: boolean
        public IsItalic: boolean
        public IsStrikethrough: boolean
        public IsUnderline: boolean
        public IsCode: boolean
        public IsSubscript: boolean
        public IsSuperscript: boolean
        //public IS_HIGHLIGHT: boolean

        public FontSize: string
        public FontColor: string
        public BackgroundColor: string
        public FontFamily: string
        public LineHeight: string

        public IsQuote: boolean
        public HeadingType: HeadingTagType;
        public IsListBulletList: boolean
        public IsOrderedList: boolean
        public Alignment: string
}