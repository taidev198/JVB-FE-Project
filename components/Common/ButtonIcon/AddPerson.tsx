import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Tooltip } from '@mui/material';
import React from 'react';
interface ButtonAddPersonProps {
  onClick: () => void;
  className?: string;
}
const ButtonAddPerson: React.FC<ButtonAddPersonProps> = React.memo(({ onClick }) => {
  return (
    <Tooltip title="Đồng ý">
      <div className="cursor-pointer rounded-lg bg-[#0098681a] px-2 py-[6px] transition-all hover:bg-[#00986849]" onClick={onClick}>
        <PersonAddIcon color="success" fontSize="small" />
      </div>
    </Tooltip>
  );
});
export default ButtonAddPerson;
