import classNames from 'classnames';
import { Avatar } from '@mui/material';
import { useAppSelector } from '@/store/hooks';

const UserChatItem = ({ fullName, onClick, id, lastMessage, time, isRead }) => {
  const activeId = useAppSelector(state => state.chat.idRoom);
  const btnIsRead = classNames('', {
    'text-green-500': !isRead && id !== activeId,
    'text-gray-500': isRead || id === activeId,
  });

  const btnIsActive = classNames('', {
    'text-[#4B465C]': id !== activeId,
    'text-white': id === activeId,
  });
  return (
    <li className={`${id === activeId ? 'bg-chat-item' : ''} cursor-pointer rounded-lg transition-all`} onClick={onClick}>
      <div className={`flex gap-3 px-2 py-1 sm:px-3 sm:py-2`}>
        <Avatar>a</Avatar>
        <div className="flex w-[60%] flex-col text-[13px] font-medium lg:text-[15px]">
          <span className={`${btnIsRead} ${btnIsActive} truncate font-bold`}>{fullName}</span>
          <span className={`${btnIsRead} ${btnIsActive} truncate`}>{lastMessage}</span>
        </div>
        <div className={`${btnIsRead} ${btnIsActive} ml-auto text-[13px] font-medium`}>{time}</div>
      </div>
    </li>
  );
};
export default UserChatItem;
