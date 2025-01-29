import React, { useCallback, useContext } from 'react';
import SelectProps from './props/ISelectProps';
import SelectBase from '~/components/SelectBase';

const defaultHeadingOptions: any = [
  ['', 'normal'],
  ['c', 'C'],
  ['csharp', 'csharp'],
  ['c-like', 'C-like'],
  ['html', 'HTML'],
  ['xml', 'XML'],
  ['sql', 'SQL'],
  ['typescript', 'TypeScript'],
  ['java', 'Java'],
  ['javascript', 'JavaScript'],
  ['plain text', 'Plain Text']
];

const CodeSelect = ({ selectedOption, callback }: SelectProps<string>) => {


  const onSelect = useCallback(
    (e: any ) => {
      callback(e.target.value);
    },
    [callback]
  );

  return (
    <>
      <SelectBase
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm block w-20 p-1.3"
        onChange={onSelect}
        options={defaultHeadingOptions}
        value={selectedOption}
      />
      <i className="chevron-down inside" />
    </>
  );
};

export default CodeSelect;