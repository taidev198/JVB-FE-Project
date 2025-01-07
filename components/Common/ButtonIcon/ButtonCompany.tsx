import InterpreterModeIcon from '@mui/icons-material/InterpreterMode';
import { Tooltip } from '@mui/material';
import Link from 'next/link';
import React, { FC } from 'react';
interface ButtonCompanyApplyProps {
  href: string;
  onClick: () => void;
  title: string;
}
const ButtonCompanyApply: FC<ButtonCompanyApplyProps> = React.memo(({ href, onClick, title }) => {
  return (
    <Tooltip title={title}>
      <Link href={href}>
        <div onClick={onClick} className="cursor-pointer rounded-lg bg-[#6137e927] px-2 py-[6px] transition-all hover:bg-[#1966d254]">
          <InterpreterModeIcon color="inherit" fontSize="small" />
        </div>
      </Link>
    </Tooltip>
  );
});
export default ButtonCompanyApply;
