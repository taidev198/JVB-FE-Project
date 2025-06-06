import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Tooltip } from '@mui/material';
const ButtonArrow = () => {
  return (
    <Tooltip title="Xuống">
      <div className="cursor-pointer rounded-lg py-[6px] transition-all hover:bg-[#80807f1a]">
        <ArrowDownwardIcon style={{ fontSize: 12 }} color="inherit" />
      </div>
    </Tooltip>
  );
};
export default ButtonArrow;
