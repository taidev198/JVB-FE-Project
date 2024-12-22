import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Tooltip } from '@mui/material';

const ButtonAccept = ({ onClick }) => {
  return (
    <Tooltip title="Chấp nhận">
      <div className="cursor-pointer rounded-lg bg-[#0098681a] px-2 py-[6px] transition-all hover:bg-[#00986849]" onClick={onClick}>
        <DoneAllIcon color="success" fontSize="small" />
      </div>
    </Tooltip>
  );
};
export default ButtonAccept;
