

type Props = {
    value: string;
    onDeleteClick: any;
    onEditClick: any;
}

export default function Tag({ value, onDeleteClick, onEditClick } : Props): JSX.Element {


    return (
        <div  className="badge badge-outline text-black max-w-24">
            <div className="cursor-pointer truncate max-w-20" onClick={onEditClick}>{value}</div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-4 w-4 stroke-current cursor-pointer"
                onClick={onDeleteClick}>
                
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            
        </div>
    );

}