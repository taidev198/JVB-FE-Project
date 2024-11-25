import { RefObject, useEffect } from 'react';

export const useOnClickOutside = (ref: RefObject<HTMLDivElement>, handler: Function, menuTop?: RefObject<HTMLElement>) => {
  useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node) || menuTop?.current?.contains(e.target as Node)) {
        return;
      }

      handler(e);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, menuTop]);
};
