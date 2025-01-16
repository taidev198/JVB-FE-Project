/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { Drawer, useMediaQuery, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client'; // Import SockJS for WebSocket fallback
import SearchIcon from '@mui/icons-material/Search';
import UserChatItem from './UserChatItem';
import { showSidebar } from '@/store/slices/global';
import { useGetAllChatRoomsQuery } from '@/services/portalHomeApi';
import { useAppSelector } from '@/store/hooks';
import { setIdRoom, setNamePartnerChat, setReceiverId } from '@/store/slices/chatSlice';

const SidebarChat = () => {
  const userId = useAppSelector(state => state.user.idAccount);
  const dispatch = useDispatch();

  const { data, refetch } = useGetAllChatRoomsQuery(
    { userId },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    const connectToWebSocket = () => {
      const client = new Client({
        webSocketFactory: () => new SockJS('http://192.168.0.152:8082/ws/stomp'),
        onConnect: () => {
          client.subscribe(`/topic/new-chatroom`, () => {
            refetch();
          });
        },
        onStompError: frame => {
          console.error('STOMP Error:', frame.headers['message']);
          console.error('Details:', frame.body);
        },
      });

      client.activate();
      return client;
    };

    const client = connectToWebSocket();

    return () => {
      if (client) client.deactivate();
    };
  }, [refetch]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className=" border-b border-solid bg-white px-0 py-4 sm:px-5">
        <div className="flex items-center rounded-[20px] border border-[#DBDADE] px-[14px]">
          <SearchIcon className="text-[#4B465C]" />
          <input type="text" className="w-[90%] border-none placeholder:text-[15px] placeholder:text-[#4B465C]" placeholder="Tìm kiếm đoạn chat..." />
        </div>
      </div>
      <div className="max-h-screen overflow-y-auto px-0 sm:px-3">
        <p className="px-1 py-[10px] text-lg font-medium text-[#246AA3] sm:px-4">Trò chuyện</p>
        <ul className="flex flex-col gap-1">
          {data?.data?.content.map(user => (
            <UserChatItem
              fullName={user?.member.id !== userId ? user?.memberName : user?.ownerName}
              id={user?.id}
              key={user?.id}
              onClick={() => {
                dispatch(setIdRoom(user.id));
                dispatch(setNamePartnerChat(user?.member.id !== userId ? user?.memberName : user?.ownerName));
                dispatch(setReceiverId(user?.member.id !== userId ? user?.member.id : user?.owner.id));
              }}
              lastMessage={user?.lastMessage.content}
              time={dayjs(user?.lastMessage.createAt).format('HH:mm')}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

const ChatLeft = () => {
  const theme = useTheme();
  const isMobileAndTablet = useMediaQuery(theme.breakpoints.down('sm'));
  const isShowSidebar = useSelector((store: any) => store.global.showSidebar);
  const dispatch = useDispatch();
  return isMobileAndTablet ? (
    <Drawer open={isShowSidebar} onClose={() => dispatch(showSidebar())} classes={{ paper: 'w-3/4 max-w-[400px] p-4 flex flex-col gap-6' }}>
      <SidebarChat />
    </Drawer>
  ) : (
    <SidebarChat />
  );
};
export default ChatLeft;
