import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Tooltip } from '@mui/material';
import { FC } from 'react';

export interface ButtonUpProps {
  isSort?: boolean;
}

const ButtonUp: FC<ButtonUpProps> = ({ isSort }) => {
  return (
    <Tooltip title="Lên">
      <div className={`rounded-lg opacity-30 ${isSort ? '' : 'opacity-30'} transition-all hover:bg-[#80807f1a]`}>
        <ArrowDropUpIcon color="inherit" viewBox="0 -8 24 24" />
      </div>
    </Tooltip>
  );
};
export default ButtonUp;
