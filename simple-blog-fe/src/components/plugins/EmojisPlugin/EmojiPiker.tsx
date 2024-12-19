import { faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useContext, useState } from 'react';
import SelectProps from '~/components/admin/editor/toolbar/props/ISelectProps';

const EmojiPiker = ({ selectedOption, currentEditor, callback }: SelectProps<string>) => {


  const [isOpen, setIsOpen] = useState<boolean>(false)

  const onSelect = useCallback(
    (e: any ) => {
      callback(e.target.value);
    },
    [callback]
  );

  return (
    
      <>
      <button
      onClick={() => {
        setIsOpen(!isOpen);
      } }
    >
      <FontAwesomeIcon icon={faFaceSmile} className="text-white w-3.5 h-3.5" />
    </button></>
    
  );
};

export default EmojiPiker;