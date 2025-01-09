import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Tooltip } from '@mui/material';
const ButtonUp = () => {
  return (
    <Tooltip title="Lên">
      <div className="cursor-pointer rounded-lg py-[6px] transition-all hover:bg-[#80807f1a]">
        <ArrowDropUpIcon style={{ fontSize: 12 }} color="inherit" />
      </div>
    </Tooltip>
  );
};
export default ButtonUp;
