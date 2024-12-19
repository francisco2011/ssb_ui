import { HexColorInput, HexColorPicker } from "react-colorful";

function ColorPicker({ onChange, initialColor }) {

  const presetColors = [
    '#d0021b',
    '#f5a623',
    '#f8e71c',
    '#8b572a',
    '#7ed321',
    '#417505',
    '#bd10e0',
    '#9013fe',
    '#4a90e2',
    '#50e3c2',
    '#b8e986',
    '#000000',
    '#4a4a4a',
    '#9b9b9b',
    '#ffffff',
  ];
    
    return(
        <div>
        <HexColorInput color={initialColor} onChange={onChange} placeholder="Type a color" prefixed alpha />
        <HexColorPicker color={initialColor} onChange={onChange} />
  
        <div className="flex p-1 flex-wrap">
          {presetColors.map((presetColor) => (
            <button
              key={presetColor}
              className="w-6 h-6 m-1 border-none p-0 rounded outline-none cursor-pointer"
              style={{ background: presetColor }}
              onClick={() => onChange(presetColor)}
            />
          ))}
        </div>
      </div>
    );

}

export default ColorPicker;