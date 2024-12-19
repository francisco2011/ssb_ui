import React, { useCallback, useContext } from 'react';
import SelectProps from './props/ISelectProps';
import SelectBase from '~/components/SelectBase';

const defaultOptions: any = [
  ['normal', 'normal'],
  ['1.0', '1.0'],
  ['1.2', '1.2'],
  ['1.5', '1.5'],
  ['1.7', '1.7'],
  ['2.0', '2.0'],
  ['2.5', '2.5']
];

const LineHeightSelect = ({ selectedOption, currentEditor, callback }: SelectProps<string>) => {


  const onSelect = useCallback(
    (e: any ) => {
      callback({ 'line-height': e.target.value });
    },
    [callback]
  );

  return (
    <>
      <SelectBase
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm block w-15 p-1.3"
        onChange={onSelect}
        options={defaultOptions}
        value={selectedOption}
      />
      <i className="chevron-down inside" />
    </>
  );
};

export default LineHeightSelect;