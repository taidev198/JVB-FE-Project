import { ReactNode, MouseEvent } from 'react';
import { clsx } from 'clsx';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store/hooks';
import { setBackdrop } from '@/store/slices/global';

interface Props {
  children: ReactNode;
  className?: string;
  isCenter?: boolean;
}

export const BackDrop = ({ children, isCenter = false, className = '' }: Props): JSX.Element => {
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const dispatch = useDispatch();

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      dispatch(setBackdrop(null));
    }
  };

  return (
    <div className="fixed inset-0 z-[10]">
      <div
        className={clsx(
          isCenter && 'items-center',
          showBackdrop && 'sm:[&>div]:ml-[0]',
          'fixed inset-0 !top-[0px] z-[60] flex items-start justify-center bg-black/20 backdrop-blur-[5px] [&>div]:rounded-[8px] [&>div]:border-[1px] [&>div]:border-[#ffffff] [&>div]:bg-[#ffffff]',
          className
        )}
        onClick={handleBackdropClick}>
        {children}
      </div>
    </div>
  );
};
