import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Tooltip } from '@mui/material';
export interface ButtonArrowProp {
  isSort?: boolean;
}
const ButtonArrow = ({ isSort }: ButtonArrowProp) => {
  return (
    <Tooltip title="Xuống">
      <div className={`rounded-lg  ${isSort ? '' : 'opacity-30'} transition-all hover:bg-[#80807f1a]`}>
        <ArrowDropDownIcon color="inherit" viewBox="0 8 24 24" fontSize="medium" />
      </div>
    </Tooltip>
  );
};
export default ButtonArrow;
