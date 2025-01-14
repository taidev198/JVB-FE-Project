import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { FC } from 'react';

export interface ButtonUpProps {
  isSort?: boolean;
  onClick: () => void;
}

const ButtonUp: FC<ButtonUpProps> = ({ isSort, onClick }) => {
  return (
    <div className={`rounded-lg ${isSort ? '' : 'opacity-30'} transition-all hover:bg-[#80807f1a]`} onClick={onClick}>
      <ArrowDropUpIcon color="inherit" viewBox="0 -8 24 24" />
    </div>
  );
};
export default ButtonUp;
