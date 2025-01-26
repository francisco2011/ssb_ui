
import { LexicalEditor } from 'lexical';
import { useState, useEffect } from 'react';
import { INSERT_LAYOUT_COMMAND } from './index';
import { faPlus, faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '~/components/Button';
import { JSX } from 'react/jsx-runtime';

//reference from the original
//const LAYOUTS = [
//    { label: '2 columns (equal width)', value: '1fr 1fr' },
//    { label: '2 columns (25% - 75%)', value: '1fr 3fr' },
//    { label: '3 columns (equal width)', value: '1fr 1fr 1fr' },
//    { label: '3 columns (25% - 50% - 25%)', value: '1fr 2fr 1fr' },
//    { label: '4 columns (equal width)', value: '1fr 1fr 1fr 1fr' },
//];

type columnModel = {
    id: number
    width: number

}

export default function InsertLayoutDialog({
    activeEditor,
    onClose,
}: {
    activeEditor: LexicalEditor;
    onClose: () => void;
}): JSX.Element {
    //const [layout, setLayout] = useState('');
    const [columns, setColumns] = useState<columnModel[]>([])

    const MAX_WIDTH_PERCENTAGE = 96


    useEffect(() => {

        setColumns([{ id: 1, width: 48 }, { id: 2, width: 48 }])

    }, []);

    const buildLayout = (): string => {

        let lyt = columns.filter(c => c.width && c.width > 0).map(c => c.width + '%').join(' ')
        return lyt
    }

    const onClick = () => {

        const layout = buildLayout()
        activeEditor.dispatchCommand(INSERT_LAYOUT_COMMAND, layout);
        onClose();
    };

    const calcMaxWidth = (ignoreId?: Number) => {

        let array = [...columns];

        if (ignoreId) {
            array = array.filter(c => c.id != ignoreId)
        }

        const mSum = array.map(c => !c.width ? 0 : Number(c.width)).reduce((partialSum, a) => partialSum + a, 0);
        return MAX_WIDTH_PERCENTAGE - mSum
    }

    const addColum = () => {

        const maxVal = calcMaxWidth()

        const newCol: columnModel = { width: maxVal, id: columns.length + 1 }
        setColumns([...columns, newCol])
    }

    const deleteColum = (col: columnModel) => {
        var array = [...columns];
        setColumns(array.filter(c => c.id != col.id));
    }

    const updateCol = (e) => {

        if (!e.target.name) return
        if (!e.target.value) return


        const val = Number(e.target.value)
        const id = Number(e.target.name)

        if (val < 0) return
        if (val > calcMaxWidth(id)) return

        var array = [...columns];
        array.find(c => c.id == id).width = val
        setColumns(array)
    }



    return (
        <>
            <h2 className="text-xl font-extrabold dark:text-white my-2">
                Column width in percentaje
            </h2>
            <button
                className={"px-1 hover:bg-gray-600 transition-colors duration-100 ease-in bg-gray-400"}
                onClick={addColum}
            >
                <FontAwesomeIcon icon={faPlus} className="text-white w-3.5 h-3.5" />
            </button>

            <div className={"flex flex-row"}>
                {
                    columns.map(c =>
                        <div key={c.id} className={"mx-1 my-3"}>
                            <input type="number" name={c.id} className={"w-10"} onChange={updateCol} value={c.width}></input>
                            <button
                                className={
                                    "px-1 hover:bg-gray-600 transition-colors duration-100 ease-in bg-gray-400"

                                }
                                onClick={() => deleteColum(c)}
                            >
                                <FontAwesomeIcon icon={faRemove} className="text-white w-3.5 h-3.5" />
                            </button>
                        </div>
                    )
                }

            </div>

            <button className="btn" onClick={onClick}>Insert</button>



        </>
    );
}
