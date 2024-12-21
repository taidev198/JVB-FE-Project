import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Tooltip } from '@mui/material';

const ButtonUnLock = ({ onClick }) => {
  return (
    <Tooltip title="Mở khóa">
      <div className="cursor-pointer rounded-lg bg-[#0098681a] px-2 py-[6px] transition-all hover:bg-[#00986849]" onClick={onClick}>
        <LockOpenIcon color="success" fontSize="small" />
      </div>
    </Tooltip>
  );
};
export default ButtonUnLock;
