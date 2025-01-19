// inspired from https://medium.com/@iambharathpadhu/mastering-popovers-building-an-accessible-popover-component-in-react-with-just-html-a6e95c0be2fb
//updated for TS
//added the option to use ESC button

import React, { useState, useRef, useEffect, Reference, RefObject } from 'react';
import './Popover.css';

const Popover = ({ children, content, buttonClass }) => {
  const [isVisible, setIsVisible] = useState(false); // Manages the visibility state of the popover
  const popoverRef = useRef<HTMLDivElement>(null); // Reference to the popover element
  const triggerRef = useRef<HTMLButtonElement>(null); // Reference to the button element that triggers the popover

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current && triggerRef.current &&
        !popoverRef.current.contains(event.target) && 
         !triggerRef.current.contains(event.target)
      ) {
        setIsVisible(false); // Close the popover if clicked outside
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
          setIsVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="popover-container">
      <button
        ref={triggerRef}
        onClick={toggleVisibility}
        className={buttonClass}
        aria-haspopup="true"
        aria-expanded={isVisible}
        aria-controls="popover-content"
      >
        {children}
      </button>
      {isVisible && (
        <div
          id="popover-content"
          ref={popoverRef}
          className="popover-content"
          role="dialog"
          aria-modal="true"
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Popover;