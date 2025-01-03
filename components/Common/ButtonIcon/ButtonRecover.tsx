import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import { Tooltip } from '@mui/material';
const ButtonRecover = ({ onClick }) => {
  return (
    <Tooltip title="Khôi phục">
      <div className="cursor-pointer rounded-lg bg-[#ffa4101a] px-2 py-[6px] transition-all hover:bg-[#77f06748]" onClick={onClick}>
        <AddToDriveIcon color="success" fontSize="small" />
      </div>
    </Tooltip>
  );
};
export default ButtonRecover;
