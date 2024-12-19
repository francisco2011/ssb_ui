import { LexicalEditor } from "lexical";

interface SelectProps<selectedOptionType> {
    selectedOption: selectedOptionType;
    currentEditor: LexicalEditor;
    callback: any;
}

export default SelectProps;