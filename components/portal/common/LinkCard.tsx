/* eslint-disable*/
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import Link from 'next/link';
import React, { useEffect, useState, useCallback } from 'react';
import SockJS from 'sockjs-client'; // Import SockJS for WebSocket fallback
import { useDispatch } from 'react-redux';
import { Tooltip } from '@mui/material';
import { Client } from '@stomp/stompjs';
import { useRouter } from 'next/router';
import ImageComponent from '@/components/Common/Image';
import { useAppSelector } from '@/store/hooks';
import { useGetAChatroomQuery } from '@/services/portalHomeApi';
import { setIdRoom, setNamePartnerChat, setReceiverId } from '@/store/slices/chatSlice';

interface LinkCardProps {
  logoUrl: string;
  name: string;
  shortDes: string;
  websiteUrl: string;
  receiverId: number;
}

const LinkCard: React.FC<LinkCardProps> = ({ logoUrl, name, shortDes, websiteUrl, receiverId }) => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const idAccount = useAppSelector(state => state.user.idAccount);
  const accountName = useAppSelector(state => state.user.name);
  const [isCreatingChatRoom, setIsCreatingChatRoom] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { data: dataCheckChatroom, refetch } = useGetAChatroomQuery(
    { senderId: idAccount, receiverId: receiverId },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const connectToWebSocket = useCallback(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://192.168.0.152:8082/ws/stomp'),
      onConnect: () => {
        setStompClient(client);
        refetch();
      },
      onStompError: frame => {
        console.error('STOMP Error:', frame.headers['message']);
        console.error('Details:', frame.body);
      },
      onWebSocketClose: event => {
        console.log('WebSocket closed:', event);
      },
    });

    client.activate();
    return client;
  }, [refetch]);

  useEffect(() => {
    const client = connectToWebSocket();
    return () => {
      if (client) client.deactivate();
    };
  }, [connectToWebSocket]);

  useEffect(() => {
    if (dataCheckChatroom?.data) {
      dispatch(setIdRoom(dataCheckChatroom.data.id));
      dispatch(setNamePartnerChat(dataCheckChatroom.data.member.id !== idAccount ? dataCheckChatroom.data.memberName : dataCheckChatroom.data.ownerName));
      dispatch(setReceiverId(dataCheckChatroom.data.member.id !== idAccount ? dataCheckChatroom.data.member.id : dataCheckChatroom.data.owner.id));

      if (isCreatingChatRoom) {
        router.push('/portal/chat');
      }
    }
  }, [dataCheckChatroom, dispatch, idAccount, isCreatingChatRoom, router]);

  const sendMessage = () => {
    if (!dataCheckChatroom?.data) {
      if (stompClient && stompClient.connected) {
        stompClient.publish({
          destination: `/app/chatroom/undefined`,
          body: JSON.stringify({
            chatRoomId: undefined,
            senderId: idAccount,
            receiverId: receiverId,
            content: `Xin chào ${name}, tôi là ${accountName}, xin hãy dành một chút thời gian trao đổi với tôi nhé`,
            chatType: 'TEXT',
          }),
        });

        setIsCreatingChatRoom(true);

        setTimeout(() => {
          refetch();
        }, 1000);
      } else {
        console.error('STOMP client is not connected!');
      }
    } else {
      router.push('/portal/chat');
    }
  };

  return (
    <div className="link flex flex-col items-center justify-between gap-[40px] rounded-[10px] bg-custom-gradient-1 p-[30px]">
      <div className="flex flex-col items-center gap-[20px] text-center">
        <div className="flex h-[100px] w-[100px] flex-col items-center justify-center rounded-md bg-primary-white">
          <ImageComponent src={logoUrl} alt="logo" width={60} height={60} className="object-contain" />
        </div>
        <h3 className="line-clamp-2 text-center text-[32px] font-bold text-primary-black">{name}</h3>
        <p className="text-center text-lg text-primary-gray">{shortDes}</p>
      </div>
      <div className="flex items-center justify-center gap-5">
        <Link
          href={websiteUrl}
          target="_blank"
          className="mp_transition_4 z-[2] rounded-md bg-primary-main p-[20px] text-center text-lg font-medium tracking-wide text-white hover:bg-primary-black">
          Truy cập website
        </Link>
        <Tooltip title="Trò chuyện ngay">
          <button
            onClick={sendMessage}
            className="mp_transition_4 flex cursor-pointer items-center gap-2 rounded-[6px] border-[1px] border-solid border-primary-main p-[20px] font-medium text-primary-main hover:bg-primary-main hover:text-white">
            {/*<ChatIcon style={{ width: '40px', height: '40px' }} />*/}
            Trò chuyện
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default LinkCard;

