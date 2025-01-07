import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import { Tooltip } from '@mui/material';
import React from 'react';
interface ButtonRecoverProps {
  onClick: () => void;
  className?: string;
}
const ButtonRecover: React.FC<ButtonRecoverProps> = React.memo(({ onClick }) => {
  return (
    <Tooltip title="Khôi phục">
      <div className="cursor-pointer rounded-lg bg-[#ffa4101a] px-2 py-[6px] transition-all hover:bg-[#77f06748]" onClick={onClick}>
        <AddToDriveIcon color="success" fontSize="small" />
      </div>
    </Tooltip>
  );
});
export default ButtonRecover;
