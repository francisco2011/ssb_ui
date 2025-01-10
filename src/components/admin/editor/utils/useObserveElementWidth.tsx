//taken from: https://codesandbox.io/p/sandbox/useobserveelementwidth-resizable-box-example-03whv2?file=%2Fsrc%2FApp.tsx%3A6%2C4-6%2C67
//

import { useState, useRef, useEffect } from "react";

export const useObserveElementWidth = <T extends HTMLElement>() => {
  const [width, setWidth] = useState(0);
  const ref = useRef<T>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {

        if(entries && entries.length > 0 && entries[0]) setWidth(entries[0].contentRect.width);
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      ref.current && observer.unobserve(ref.current);
    };
  }, []);

  return {
    width,
    ref
  };
};