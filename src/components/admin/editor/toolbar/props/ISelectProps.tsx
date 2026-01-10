import { LexicalEditor } from "lexical";

interface SelectProps<selectedOptionType, callbackType> {
    selectedOption: selectedOptionType;
    callback: callbackType;
}

export default SelectProps;