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
            const selectableOptions =  allOptions.sections.filter(c => c.name && c.tag)
                                                            .map(c => [c.tag, c.name])
            
                                                            //@ts-ignore
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