import React, { useCallback, useContext } from 'react';
import SelectProps from './props/ISelectProps';
import SelectBase from '~/components/SelectBase';
import {
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
} from '@lexical/code';


function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  )) {
    options.push([lang, friendlyName]);
  }

  return options;
}

const CodeSelect = ({ selectedOption, callback }: SelectProps<string, any>) => {


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
        options={getCodeLanguageOptions()}
        value={selectedOption}
      />
      <i className="chevron-down inside" />
    </>
  );
};

export default CodeSelect;