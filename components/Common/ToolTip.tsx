import clsx from 'clsx';
import Image from 'next/image';
import { HTMLProps } from 'react';
import TriangleSvg from '@/assets/svg/triangle.svg';

type Position = 'left' | 'right' | 'bottom' | 'top';

interface Props {
  className?: HTMLProps<HTMLElement>['className'];
  position: Position;
  children: JSX.Element | string | null;
}

export const ToolTip = ({ className, position, children }: Props) => {
  return (
    <div
      className={clsx(
        'invisible absolute z-10 flex w-[248px] opacity-0 duration-500 group-hover:visible group-hover:opacity-100',
        position === 'right' && 'bottom-1/2 left-[100px] translate-y-1/2',
        position === 'top' && 'bottom-[50px] right-1/2 translate-x-1/2 flex-col items-center',
        position === 'bottom' && 'right-1/2 translate-x-1/2 flex-col items-center',
        window.innerWidth < 450 && '!w-[100px]',
        className
      )}>
      <Image
        src={TriangleSvg}
        alt=""
        className={clsx('', position === 'top' && '-translate-y-[1px] -rotate-90', position === 'bottom' && 'translate-y-[1px] rotate-90')}
      />
      <div className={clsx('rounded-[8px] bg-black p-[7px] text-[.75rem] ', position === 'top' && 'order-first', position === 'bottom' && 'order-last')}>
        {children}
      </div>
    </div>
  );
};
