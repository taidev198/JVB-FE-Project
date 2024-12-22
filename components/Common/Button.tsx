import { MouseEvent, MouseEventHandler, ReactNode } from 'react';

interface Props {
  onClick?: MouseEventHandler;
  className?: string;
  text?: string;
  icon?: ReactNode;
  disabled?: boolean;
  full?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = ({ onClick, className, text, icon: Icon, disabled = false, full, type = 'button' }: Props): JSX.Element => {
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      disabled={disabled}
      type={type}
      onClick={handleClick}
      className={`flex h-[42px] ${
        full ? 'w-full' : ''
      }  items-center justify-center gap-[5px] whitespace-nowrap rounded-[8px] border-[1px] bg-primary-main px-[21px] text-white hover:bg-[#2e7b42] disabled:bg-[#676767] ${className} ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      } transform transition-all duration-300 ease-in-out`}>
      {Icon}
      {text && <span>{text}</span>}
    </button>
  );
};
