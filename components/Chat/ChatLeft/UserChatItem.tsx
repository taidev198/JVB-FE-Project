import { Avatar } from '@mui/material';
import { useAppSelector } from '@/store/hooks';

const UserChatItem = ({ fullName, onClick, id }) => {
  const activeId = useAppSelector(state => state.chat.idRoom);

  return (
    <li className={`${id === activeId ? 'bg-chat-item' : ''} cursor-pointer rounded-lg transition-all`} onClick={onClick}>
      <div className="flex gap-3 px-2 py-1 sm:px-3 sm:py-2">
        <Avatar>{fullName[0]?.toUpperCase()}</Avatar>
        <div className="flex w-[60%] flex-col text-[13px] font-medium lg:text-[15px]">
          <span className={`${id === activeId ? 'text-white' : 'text-[#4B465C]'} truncate font-bold`}>{fullName}</span>
          <span className={`${id === activeId ? 'text-white' : 'text-[#4B465C]'} truncate `}>Refer friends. Get rewards.</span>
        </div>
        <div className={`${id === activeId ? 'text-white' : 'text-[#4B465C]'} ml-auto text-[13px] font-medium`}>8 giờ</div>
      </div>
    </li>
  );
};
export default UserChatItem;
