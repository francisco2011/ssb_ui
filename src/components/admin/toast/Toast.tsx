export enum AlertType {
    SUCCESS,
    ERROR,
    WARNING,
    INFO
}

export type ToastConfig = {
    type: AlertType,
    title: string,
    content: string
}

const AlertTypeClassDic: { [key in AlertType]: string } = {
    [AlertType.SUCCESS]: "alert-success",
    [AlertType.INFO]: "alert-info",
    [AlertType.ERROR]: "alert-error",
    [AlertType.WARNING]: "alert-warning",
}


export default function Toast({ type, title, content }: ToastConfig) {

    const alert = "alert " + AlertTypeClassDic[type];

    return (

        <div className="toast toast-top toast-end" >
            <div className={alert}>
                <h2>{title}</h2>
                <span>{content}</span>
            </div>
        </div>

    );
}