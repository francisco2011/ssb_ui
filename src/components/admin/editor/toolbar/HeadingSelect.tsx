import React, { useCallback, useContext } from 'react';
import SelectProps from './props/ISelectProps';
import SelectBase from '~/components/SelectBase';

const defaultHeadingOptions: any = [
  ['', 'Paragraph'],
  ['h1', 'h1'],
  ['h2', 'h2'],
  ['h3', 'h3'],
  ['h4', 'h4'],
  ['h5', 'h5'],
  ['h6', 'h6']
];

const HeadingSelect = ({ selectedOption, currentEditor, callback }: SelectProps<string>) => {


  const onSelect = useCallback(
    (e: any ) => {
      callback(e.target.value);
    },
    [callback]
  );

  return (
    <>
      <SelectBase
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm block w-full p-1.3"
        onChange={onSelect}
        options={defaultHeadingOptions}
        value={selectedOption}
      />
      <i className="chevron-down inside" />
    </>
  );
};

export default HeadingSelect;