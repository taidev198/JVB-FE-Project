import { ReactNode, RefObject } from 'react';
import { clsx } from 'clsx';

interface Props {
  refPopup: RefObject<HTMLDivElement>;
  children: ReactNode;
  className?: string;
}

export const Popup = ({ refPopup, children, className = '' }: Props): JSX.Element => {
  return (
    <div className="popup">
      <div ref={refPopup} className={clsx('max-w-[528px] border', className)}>
        {children}
      </div>
    </div>
  );
};
