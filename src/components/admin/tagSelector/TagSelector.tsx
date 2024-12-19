import { useCallback, useEffect, useRef, useState } from "react";
import Tag from "./Tag";

export default function TagSelector({ externalValues, isClean, onNewCallback }): JSX.Element {

    const [values, setValues] = useState<string[]>([])
    const input = useRef<HTMLInputElement>(null);


    useEffect(() => {

        if (!isClean) return;
        cleanInput()
        setValues([])


    }, [isClean])

    useEffect(() => {

        if (!externalValues) return;

        externalValues.forEach(element => {
            addValue(element)
        });

    }, [externalValues])

    const deleteValue = useCallback((value) => {
        setValues(values.filter(c => c != value));

    }, [values])

    const handleKeyPress = e => {
        if (e.key === "Enter") {

            const val = e.target.value
            if (val) {
                addValue(val)
                cleanInput()
            }
        }
    }

    const editValue = useCallback((val) => {
        if (input?.current) {
            deleteValue(val)
            input.current.value = val
        }

    }, [input, values])

    const addValue = val => {

        if (values.indexOf(val) == -1) {
            setValues([...values, val])

            onNewCallback(val)
        }
    }

    const cleanInput = () => {
        if (input?.current?.value)
            input.current.value = "";
    }

    return (
        <div className="bg-base-200 rounded-box">
            <h4 className="text-black text-center">Tags</h4>
            <div className="m-2">
                <label className="input flex items-center ">
                    <input
                        type="text"
                        className="input input-xs w-full text-black"
                        onKeyDown={handleKeyPress}
                        ref={input}
                        placeholder="Type here" />
                    <kbd onClick={() => cleanInput()} className="kbd kbd-sm cursor-pointer">X</kbd>
                </label>

            </div>
            <div className="card bg-base-100">
                <div className="flex flex-wrap justify-center px-4 md:px-2">
                    {
                        values.map(c => <div key={c} className="m-1"><Tag value={c} onDeleteClick={() => deleteValue(c)} onEditClick={() => editValue(c)} /></div>)
                    }
                </div>
            </div>
        </div>
    );

}