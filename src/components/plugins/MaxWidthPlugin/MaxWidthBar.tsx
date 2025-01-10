import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function MaxWidthBar({ maxWidth, defaultWidth, onMaxChanged }: { maxWidth: number, defaultWidth: string, onMaxChanged: (val: number) => void }) {
    const [selectedLength, setSelectedLength] = useState(maxWidth);


    useEffect(() => {
        
        debugger
        const dv = Number(defaultWidth.replace("px", '')) / 10
        
        setSelectedLength(dv)

      }, [defaultWidth]);

    const clazz = "h-8 w-[" + maxWidth + "px] bg-gray-200 rounded-sm grid grid-rows-2 grid-flow-col pl-[20px]"

    const steps = maxWidth / 10
    const mSteps = maxWidth / 100
    const offset = maxWidth % 100

    const allSteps: any[] = [];
    for (var i = 0; i < steps - 1; i++) {

        var k = i + 1

        allSteps.push({ val: k });
    }

    const allMSteps: React.JSX.Element[] = [<div key={0} className="w-[100px]"></div>];
    for (var i = 0; i < mSteps - 1; i++) {
        allMSteps.push(<div key={i + 1} className="w-[100px] text-[10px]">{(i + 1) * 100}</div>);
    }

    const onMaxLengthSelected = (val) => {

        const sl = ( val * 10 ) + "px"

        setSelectedLength(sl)
        onMaxChanged((val * 10) + 30)
    }

    return (
        <>

            <div className="text-end text-xs">
                {
                    (selectedLength) 
                }
            </div>

            <div className={clazz}>
                <div className="flex">
                    {
                        allMSteps
                    }
                </div>
                <div className="flex">
                    <div key={0} className="w-[10px]">|</div>
                    {
                        allSteps.map(c => selectedLength == c.val  ? <div key={c.val} className="w-[10px] cursor-pointer" onClick={() => onMaxLengthSelected(c.val)}>
                            <FontAwesomeIcon icon={faCircle} className="text-black w-3 h-3" /></div>
                            : <div key={c.val} className="w-[10px] text-[10px] cursor-pointer" onClick={() => onMaxLengthSelected(c.val)}>|</div>)
                    }
                </div>
            </div>
        </>
    );
}