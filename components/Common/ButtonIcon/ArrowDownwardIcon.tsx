import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
export interface ButtonArrowProp {
  isSort?: boolean;
  onClick: () => void;
}
const ButtonArrow = ({ isSort, onClick }: ButtonArrowProp) => {
  return (
    <div className={`rounded-lg  ${isSort ? '' : 'opacity-30'} transition-all hover:bg-[#80807f1a]`} onClick={onClick}>
      <ArrowDropDownIcon color="inherit" viewBox="0 8 24 24" fontSize="medium" />
    </div>
  );
};

export default ButtonArrow;
