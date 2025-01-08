import CancelIcon from '@mui/icons-material/Cancel';
import { Tooltip } from '@mui/material';
import React from 'react';
interface ButtonRejectProps {
  onClick: () => void;
  className?: string;
}
const ButtonReject: React.FC<ButtonRejectProps> = React.memo(({ onClick }) => {
  return (
    <Tooltip title="Từ chối">
      <div className="cursor-pointer rounded-lg bg-[#ffa4101a] px-2 py-[6px] transition-all hover:bg-[#ffa31048]" onClick={onClick}>
        <CancelIcon color="warning" fontSize="small" />
      </div>
    </Tooltip>
  );
});
export default ButtonReject;
