const editorTheme = {
    ltr: 'ltr',
    rtl: 'rtl',
    mark: 'PlaygroundEditorTheme__mark',
    markOverlap: 'PlaygroundEditorTheme__markOverlap',
    placeholder: "editor-placeholder",
    paragraph: "relative",
    quote: "editor-quote",
    heading: {
      h1: "text-3xl font-extrabold dark:text-white",
      h2: "text-2xl font-bold dark:text-white",
      h3: "text-xl font-bold dark:text-white",
      h4: "text-lg font-bold dark:text-white",
      h5: "font-bold dark:text-white",
    },
    list: {
      listitem: 'PlaygroundEditorTheme__listItem',
      nested: {
        listitem: 'PlaygroundEditorTheme__nestedListItem',
      },
      olDepth: [
        'PlaygroundEditorTheme__ol1',
        'PlaygroundEditorTheme__ol2',
        'PlaygroundEditorTheme__ol3',
        'PlaygroundEditorTheme__ol4',
        'PlaygroundEditorTheme__ol5',
      ],
      ul: 'PlaygroundEditorTheme__ul',
    },
    image: "editor-image",
    link: "font-medium text-blue-600 dark:text-blue-500 hover:underline",
    text: {
      bold: "font-bold",
      italic: "italic",
      overflowed: "editor-text-overflowed",
      hashtag: "editor-text-hashtag",
      underline: "underline",
      strikethrough: "line-through",
      underlineStrikethrough: "underline line-through",
      code: "font-mono text-[94%] bg-gray-100 dark:bg-gray-600 dark:text-white p-1 rounded",
    },
		code: "bg-gray-200 dark:bg-gray-600 font-mono block py-2 px-8 leading-1 m-0 mt-2 mb-2 tab-2 overflow-x-auto relative before:absolute before:content-[attr(data-gutter)] before:bg-gray-200 dark:before:bg-gray-700 before:left-0 before:top-0 before:p-2 before:min-w-[25px] before:whitespace-pre-wrap before:text-right after:content-[attr(data-highlight-langrage)] after:right-3 after:absolute",
    codeHighlight: {
      atrule: "text-[#07a] dark:text-cyan-400",
      attr: "text-[#07a] dark:text-cyan-400",
      boolean: "text-pink-700 dark:text-pink-400",
      builtin: "text-[#690]",
      cdata: "bg-slate-600",
      char: "text-[#690]",
      class: "text-[#dd4a68]",
      "class-name": "text-[#dd4a68]",
      comment: "bg-slate-200 dark:bg-gray-600",
      constant: "text-pink-700 dark:text-pink-400",
      deleted: "text-pink-700 dark:text-pink-400",
      doctype: "bg-slate-600",
      entity: "text-[#9a6e3a]",
      function: "text-[#dd4a68]",
      important: "text-[#e90]",
      inserted: "text-[#690]",
      keyword: "text-[#07a] dark:text-cyan-400",
      namespace: "text-[#e90] dark:text-blue-400",
      number: "text-pink-700 dark:text-pink-400",
      operator: "text-[#9a6e3a]",
      prolog: "bg-slate-600",
      property: "text-pink-700 dark:text-pink-400",
      punctuation: "text-[#999]",
      regex: "text-[#e90] dark:text-blue-400",
      selector: "text-[#690]",
      string: "text-[#690] dark:text-orange-500",
      symbol: "text-pink-700 dark:text-pink-400",
      tag: "text-pink-700 dark:text-pink-400",
      url: "text-[#9a6e3a]",
      variable: "text-[#e90] dark:text-blue-400",
    },
  };
  
  export default editorTheme;