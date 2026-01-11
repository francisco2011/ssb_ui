import React, { useCallback, useContext, useEffect, useState } from 'react';
import SelectProps from './props/ISelectProps';
import SelectBase from '~/components/SelectBase';
import SectionService from '~/services/SectionService';

export type SelectionResult = {
  tag: string
}

const SectionSelect = ({ selectedOption, callback }: SelectProps<string, (selectionResult: SelectionResult) => void>) => {

    const [options, setOptions] = useState<[string, string][]>([])

    var service = new SectionService();

useEffect(() => {

    const get = async () =>{
        const allOptions = await service.List(100,0)

        if(allOptions.sections){
          //@ts-ignore
            let selectableOptions:[string, string][] = allOptions.sections.filter(c => c.name && c.tag != null)
                                                            .map(c => [c.tag, c.name])
            
                                                            //@ts-ignore
            selectableOptions = [["Select section","Selection section"] , ...selectableOptions]

            setOptions(selectableOptions)
        }
    } 

    get()

}, [])

  const onFontSizeSelect = useCallback(
    (e: any ) => {
      callback({ tag: e.target.value });
    },
    [callback]
  );

  return (
    <>
      <SelectBase
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm block w-full p-1.3"
        onChange={onFontSizeSelect}
        options={options}
        value={selectedOption}
      />
      <i className="chevron-down inside" />
    </>
  );
};

export default SectionSelect;