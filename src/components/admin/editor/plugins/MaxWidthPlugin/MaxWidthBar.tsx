import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export enum Unit{
    rem = "rem",
    px = "px"
}

export default function MaxWidthBar({ maxWidth, defaultWidth, unit, onMaxChanged }: { maxWidth: number, 
                                    defaultWidth: string, unit: Unit, onMaxChanged: (val: number) => void }) {
    const [selectedLength, setSelectedLength] = useState(maxWidth);
    const [selectedLengthLabel, setSelectedLengthLabel] = useState(maxWidth  + "rem")

    var unitStr = unit.toString()

    useEffect(() => {
        
        setSelectedLengthLabel(defaultWidth)

        const dv = Number(defaultWidth.replace(unitStr, '')) 
        setSelectedLength(dv)
        

      }, [defaultWidth]);

    

    const steps = maxWidth 
    const mSteps = maxWidth /10

    const allSteps: any[] = [];
    for (var i = 0; i < steps - 1; i++) {

        var k = i + 1

        allSteps.push({ val: k });
    }


    const allMSteps: React.JSX.Element[] = [<div key={0} className="w-[10rem]"></div>];
    for (var i = 0; i < mSteps - 1; i++) {
        allMSteps.push(<div key={i + 1} className={"w-[10rem] text-[1rem]"}>{(i * 10 + 10)}</div>);
    }
    const onMaxLengthSelected = (val) => {

        const maxValue = val 
        const sl = maxValue + unitStr

        setSelectedLength(maxValue)
        setSelectedLengthLabel(sl)
        onMaxChanged((maxValue))
    }

    return (
        <>

            <div className="text-end text-xs">
                {
                    (selectedLengthLabel) 
                }
            </div>

            <div className={"h-8 w-[" + maxWidth + unitStr + " ] bg-gray-200 rounded-sm grid grid-rows-2 grid-flow-col"}>
                <div className="flex">
                    {
                        allMSteps
                    }
                </div>
                <div className="flex">
                    <div key={0} className="w-[1rem]">|</div>
                    {
                        allSteps.map(c => selectedLength == c.val  ? <div key={c.val} className="w-[1rem] cursor-pointer" onClick={() => onMaxLengthSelected(c.val)}>
                            <FontAwesomeIcon icon={faCircle} className="text-black w-3 h-3" /></div>
                            : <div key={c.val} className="w-[1rem] text-[1rem] cursor-pointer" onClick={() => onMaxLengthSelected(c.val)}>|</div>)
                    }
                </div>
            </div>
        </>
    );
}