import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { useAppSelector } from '@/store/hooks';

interface Props {
  children: ReactNode;
  className?: string;
  isCenter?: boolean;
}

export const BackDrop = ({ children, isCenter = false, className = '' }: Props): JSX.Element => {
  const showBackdrop = useAppSelector(state => state.global.showBackdrop);
  return (
    <div className="fixed inset-0 z-[10]">
      <div
        className={clsx(
          isCenter && 'items-center',
          showBackdrop && 'sm:[&>div]:ml-[260px]',
          'fixed inset-0 !top-[0px] z-[60] flex items-start justify-center  bg-black/20 backdrop-blur-[5px] [&>div]:rounded-[8px] [&>div]:border-[1px] [&>div]:border-[#3c3c3c] [&>div]:bg-[#202123]',
          className
        )}>
        {children}
      </div>
    </div>
  );
};
