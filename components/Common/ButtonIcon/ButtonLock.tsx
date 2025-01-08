import LockPersonIcon from '@mui/icons-material/LockPerson';
import { Tooltip } from '@mui/material';
import React from 'react';
interface ButtonLockProps {
  onClick: () => void;
  className?: string;
}
const ButtonLock: React.FC<ButtonLockProps> = React.memo(({ onClick }) => {
  return (
    <Tooltip title="Khóa">
      <div className="cursor-pointer rounded-lg bg-[#a70a291a] px-2 py-[6px] transition-all hover:bg-[#a70a2934]" onClick={onClick}>
        <LockPersonIcon color="error" fontSize="small" />
      </div>
    </Tooltip>
  );
});
export default ButtonLock;
