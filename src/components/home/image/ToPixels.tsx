type Props = Readonly<{
    imgUrl: string;
    durantionSec: number
  }>;

export default function ToPixels({imgUrl, durantionSec}: Props): JSX.Element {


    function execute(){
        
    }

    return (
        <img
            src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
            className="max-w-sm rounded-lg shadow-2xl" />
    );

}