import { MouseEvent, MouseEventHandler, ReactNode } from 'react';

interface Props {
  onClick: MouseEventHandler;
  className?: string;
  text?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export const Button = ({ onClick, className, text, icon: Icon, disabled = false }: Props): JSX.Element => {
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    onClick(e);
  };
  return (
    <button
      disabled={disabled}
      type="button"
      onClick={handleClick}
      className={`flex h-[42px] items-center justify-center gap-[10px] whitespace-nowrap rounded-[8px] border-[1px] border-[#707070] px-[21px] text-white disabled:bg-[#676767] ${className} ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}>
      {Icon}
      {text && <span>{text}</span>}
    </button>
  );
};
