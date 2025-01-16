/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { throttle } from 'lodash';
import SockJS from 'sockjs-client'; // Import SockJS for WebSocket fallback
import { Client } from '@stomp/stompjs';
import { Input } from 'antd';
import { useDispatch } from 'react-redux';
import { Avatar, useMediaQuery, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import MenuIcon from '@mui/icons-material/Menu';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { showSidebar } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { useGetAllMessagesQuery, useReadAllMessagesOnAChatRoomMutation } from '@/services/portalHomeApi';
import { ChatResponse } from '@/types/chatType';

const { TextArea } = Input;

const ChatRight = () => {
  const [page, setPage] = useState<number>(1);
  const size = 20;
  const [chats, setChats] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [inputValue, setInputValue] = useState<string>(null);
  const [stompClient, setStompClient] = useState(null);
  const { idRoom, namePartnerChat, receiverId } = useAppSelector(state => state.chat);
  const { idAccount } = useAppSelector(state => state.user);
  const [hoveredMessage, setHoveredMessage] = useState<number | null>(null);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobileAndTablet = useMediaQuery(theme.breakpoints.down('sm'));
  const scrollContainerRef = useRef(null);
  const previousDataRef = useRef<ChatResponse | undefined>(undefined);

  const [result] = useReadAllMessagesOnAChatRoomMutation({ chatRoomId: idRoom });

  const { data, isSuccess, refetch } = useGetAllMessagesQuery(
    { roomId: idRoom, page, size },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const refetchMessage = () => {
    setChats([]);
    setPage(1);
    setHasMore(true);
    previousDataRef.current = undefined;
  };

  useEffect(() => {
    refetchMessage();
    result({ chatRoomId: idRoom });
  }, [idRoom]);

  useEffect(() => {
    if (data && isSuccess && previousDataRef.current !== data) {
      if (!data?.data?.content.length) {
        setHasMore(false);
        return;
      }
      previousDataRef.current = data;
      setChats(prevChats => [...prevChats, ...data.data.content]);
    }
  }, [data, isSuccess, page]);

  const handleScroll = useCallback(
    throttle(() => {
      if (!hasMore) return;

      const scrollContainer = scrollContainerRef.current;
      const scrollTop = scrollContainer.scrollTop;

      // if (scrollTop <= 100) {
      //   setPage(prevPage => prevPage + 1);
      // }
    }, 500),
    [hasMore]
  );

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    scrollContainer.addEventListener('scroll', handleScroll);
    return () => {
      handleScroll.cancel();
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // ---------------- TEST ------------------
  useEffect(() => {
    const connectToWebSocket = () => {
      const client = new Client({
        webSocketFactory: () => new SockJS('http://192.168.0.152:8082/ws/stomp'),
        onConnect: () => {
          setStompClient(client);
          client.subscribe(`/topic/chatroom/${idRoom}`, () => {
            refetchMessage();
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
  }, [refetch, idRoom]);

  const sendMessage = () => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: `/app/chatroom/${idRoom}`,
        body: JSON.stringify({
          chatRoomId: idRoom,
          senderId: idAccount,
          receiverId: receiverId,
          content: inputValue,
          chatType: 'TEXT',
        }),
      });
      setInputValue('');
      refetch();
    } else {
      console.error('STOMP client is not connected!');
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="border-b bg-white py-4">
        <div className="flex h-10 items-center gap-3 px-5">
          {isMobileAndTablet && (
            <IconButton onClick={() => dispatch(showSidebar())}>
              <MenuIcon />
            </IconButton>
          )}
          <Avatar>G</Avatar>
          <p className="text-base font-medium text-gray-700">{namePartnerChat}</p>
        </div>
      </div>

      <div className="relative h-full overflow-y-auto bg-gray-50">
        <div ref={scrollContainerRef} className="h-[90%] space-y-2 overflow-y-auto p-8">
          {chats.length > 0 ? (
            chats
              .slice() // Tạo bản sao
              .reverse()
              .map(message => (
                <div key={message.id} className={`flex w-full ${message.sender.id === idAccount ? 'justify-end' : ''}`}>
                  <div
                    className={`flex max-w-[60%] ${message.sender.id === idAccount ? 'justify-end ' : ''}`}
                    onMouseEnter={() => setHoveredMessage(message.id)}
                    onMouseLeave={() => setHoveredMessage(null)}>
                    <div className="my-1 flex flex-col">
                      <div
                        className={`flex rounded-bl-lg rounded-br-lg px-4 py-2 shadow-lg ${
                          message.sender.id === idAccount ? ' justify-end rounded-tl-lg bg-[#246AA3] text-white' : 'rounded-tr-lg bg-white'
                        }`}>
                        <p>{message.content}</p>
                      </div>
                      <p className={`${message.sender.id === idAccount ? 'text-right' : 'text-left'} mt-1 text-xs text-[#4B465C]`}>
                        {dayjs(message.createAt).format('HH:mm')}
                      </p>
                    </div>
                  </div>
                  {hoveredMessage === message.id && (
                    <div className={`${message.sender.id === idAccount ? 'justify-start' : ''}`}>
                      <IconButton className="!p-2">
                        <MoreVertIcon className="text-primary-main" fontSize="medium" />{' '}
                      </IconButton>
                    </div>
                  )}
                </div>
              ))
          ) : (
            <p className="text-center">Hãy bắt đầu cuộc trò chuyện bằng một lời chào 😍</p>
          )}
        </div>

        <div className="absolute bottom-5 left-1/2 flex w-[96%] -translate-x-1/2 transform items-center rounded-lg bg-white shadow-md">
          <TextArea
            rows={1}
            value={inputValue}
            placeholder="Nhập tin nhắn..."
            className="w-full resize-none border-none focus:outline-none"
            onChange={e => setInputValue(e.target.value)}
          />
          <IconButton className="!p-2" onClick={() => sendMessage()}>
            <SendIcon className="text-primary-main" fontSize="medium" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ChatRight;
