import { LexicalEditor } from "lexical";

interface SelectProps<selectedOptionType> {
    selectedOption: selectedOptionType;
    callback: any;
}

export default SelectProps;