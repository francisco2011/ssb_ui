import React, { useCallback, useContext } from 'react';
import SelectProps from './props/ISelectProps';

const defaultFontFamilyOptions: any = [
    ['Arial', 'Arial'],
    ['Verdana', 'Verdana'],
    ['Tahoma', 'Tahoma'],
    ['Trebuchet MS', 'Trebuchet MS'],
    ['Times New Roman', 'Times New Roman'],
    ['Georgia', 'Georgia'],
    ['Garamond', 'Garamond'],
    ['Courier New', 'Courier New'],
    ['Brush Script MT', 'Brush Script MT'],
    ['Share Tech Mono','Share Tech Mono'],
    ['Anton','Anton'],
    ['Bangers','Bangers'],
    ['Jaro','Jaro'],
    ['Kanit','Kanit'],
    ['Nova Square','Nova Square'],
    ['Rubik Burned','Rubik Burned'],
    ['Geist', 'Geist']
    
  ];

const FontFamilySelect = ({ selectedOption, currentEditor, callback }: SelectProps<string>) => {


  const onSelect = useCallback(
    (e: any ) => {
      callback({ 'font-family': e.target.value });
    },
    [callback]
  );

  return (
    <>


<select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm block w-full p-1.0 m-w-1" 
            onChange={onSelect} value={selectedOption}>

      {defaultFontFamilyOptions.map(([option, text]) => (
        <option style={{fontFamily: option }} key={option} value={option}>
          {text}
        </option>
      ))}
    </select>

      <i className="chevron-down inside" />
    </>
  );
};

export default FontFamilySelect;