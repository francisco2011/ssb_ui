//idea taken fron: https://github.com/facebook/lexical/discussions/5349

const states = {
        IS_BOLD: 1,
        IS_ITALIC: 1 << 1,
        IS_STRIKETHROUGH: 1 << 2,
        IS_UNDERLINE: 1 << 3,
        IS_CODE: 1 << 4,
        IS_SUBSCRIPT: 1 << 5,
        IS_SUPERSCRIPT: 1 << 6,
        IS_HIGHLIGHT: 1 << 7
};

export function getFormattingStates (decimalNumber: number) {
        // Convert decimal number to binary string & then pad with leading 0s to make it byte in length
        const binaryString = decimalNumber.toString(2).padStart(8, '0');
        // Define an object to store the formatting states
        const formattingStates: Record<keyof typeof states, boolean> = {} as Record<
          keyof typeof states,
          boolean
        >;
        // Check each bit of the binary string and set the corresponding state to true if 1.
        (Object.keys(states) as (keyof typeof states)[]).reverse().forEach((state, index) => {
          if (binaryString[index] === '1') {
            formattingStates[state] = true;
          }
        });
        return formattingStates;
      }