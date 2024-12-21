import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from '@mui/material';

const ButtonDelete = ({ onClick }) => {
  return (
    <Tooltip title="Xóa">
      <div className="cursor-pointer rounded-lg bg-[#a70a291a] px-2 py-[6px] transition-all hover:bg-[#a70a2934]" onClick={onClick}>
        <DeleteIcon color="error" fontSize="small" />
      </div>
    </Tooltip>
  );
};
export default ButtonDelete;
