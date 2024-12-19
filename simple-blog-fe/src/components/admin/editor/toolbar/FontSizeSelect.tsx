import React, { useCallback, useContext } from 'react';
import SelectProps from './props/ISelectProps';
import SelectBase from '~/components/SelectBase';

const defaultFontSizeOptions: any = [
  ['10px', '10px'],
  ['11px', '11px'],
  ['12px', '12px'],
  ['13px', '13px'],
  ['14px', '14px'],
  ['15px', '15px'],
  ['16px', '16px'],
  ['17px', '17px'],
  ['18px', '18px'],
  ['19px', '19px'],
  ['22px', '22px'],
  ['24px', '24px'],
  ['28px', '28px'],
  ['30px', '30px'],
  ['32px', '32px'],
  ['34px', '34px'],
  ['36px', '36px'],
  ['40px', '40px'],
  ['48px', '48px'],
  ['60px', '60px'],
  ['72px', '72px'],
];

const FontSizeSelect = ({ selectedOption, currentEditor, callback }: SelectProps<string>) => {


  const onFontSizeSelect = useCallback(
    (e: any ) => {
      callback({ 'font-size': e.target.value });
    },
    [callback]
  );

  return (
    <>
      <SelectBase
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm block w-full p-1.3"
        onChange={onFontSizeSelect}
        options={defaultFontSizeOptions}
        value={selectedOption}
      />
      <i className="chevron-down inside" />
    </>
  );
};

export default FontSizeSelect;