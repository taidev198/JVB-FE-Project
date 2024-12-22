import Link from 'next/link';
import BrushIcon from '@mui/icons-material/Brush';
import { Tooltip } from '@mui/material';

const ButtonUpdate = ({ onClick, href }) => {
  return (
    <Tooltip title="Chỉnh sửa">
      <Link href={href}>
        <div className="cursor-pointer rounded-lg bg-[#0098681a] px-2 py-[6px] transition-all hover:bg-[#00986849]" onClick={onClick}>
          <BrushIcon color="success" fontSize="small" />
        </div>
      </Link>
    </Tooltip>
  );
};
export default ButtonUpdate;
