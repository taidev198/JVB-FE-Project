import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Tooltip } from '@mui/material';

const ButtonAddPerson = ({ onClick }) => {
  return (
    <Tooltip title="Đồng ý">
      <div className="cursor-pointer rounded-lg bg-[#0098681a] px-2 py-[6px] transition-all hover:bg-[#00986849]" onClick={onClick}>
        <PersonAddIcon color="success" fontSize="small" />
      </div>
    </Tooltip>
  );
};
export default ButtonAddPerson;
