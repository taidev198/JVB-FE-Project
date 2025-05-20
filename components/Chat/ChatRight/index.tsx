/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { throttle } from 'lodash';
import SockJS from 'sockjs-client'; // Import SockJS for WebSocket fallback
import { Client } from '@stomp/stompjs';
import { useDispatch } from 'react-redux';
import { Avatar, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import MenuIcon from '@mui/icons-material/Menu';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ReplyIcon from '@mui/icons-material/Reply';
import ImageIcon from '@mui/icons-material/Image';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { showSidebar } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop } from '@/store/slices/global';
import { useDeleteOneMessageMutation, useGetAllMessagesQuery } from '@/services/portalHomeApi';
import { ChatResponse } from '@/types/chatType';
import PopupConfirmAction from '@/components/Common/PopupConfirmAction';
import { useSwipeable } from 'react-swipeable';

const ChatRight = () => {
  const [page, setPage] = useState<number>(1);
  const size = 20;
  const [chats, setChats] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [inputValue, setInputValue] = useState<string>('');
  const [stompClient, setStompClient] = useState(null);
  const [idDelete, setIdDelete] = useState(null);
  const [idReplyMes, setIdReplyMes] = useState(null);
  const { idRoom, namePartnerChat, receiverId } = useAppSelector(state => state.chat);
  const { idAccount } = useAppSelector(state => state.user);
  const [hoveredMessage, setHoveredMessage] = useState<number | null>(null);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobileAndTablet = useMediaQuery(theme.breakpoints.down('sm'));
  const scrollContainerRef = useRef(null);
  const previousDataRef = useRef<ChatResponse | undefined>(undefined);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const [deleteOneMessage] = useDeleteOneMessageMutation();
  const [replyingTo, setReplyingTo] = useState(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

const handleTouchStart = (e) => {
  setTouchStartX(e.changedTouches[0].clientX);
};

const handleTouchEnd = (e, message) => {
  const touchEndX = e.changedTouches[0].clientX;
  const delta = touchEndX - touchStartX;
  if (delta > 50) {
    handleSwipeReply(message.content);
  }
};

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
    if(chats?.length > 0 ) {
      chats.forEach((chat) => {
        console.log(chat);
        console.log('chat', chat.sender.id);
        console.log('idAccount', idAccount);
      }
      );
    }
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

      if (scrollTop <= 100) {
        setPage(prevPage => prevPage + 1);
      }
    }, 500),
    [hasMore]
  );

  const handleSwipeReply = (messageContent: string) => {
  setInputValue(`@${messageContent} `); // pre-fill the reply
  };


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
        webSocketFactory: () => new SockJS(`${process.env.NEXT_PUBLIC_API_URL_CHAT}/ws/stomp`),
        onConnect: () => {
          setStompClient(client);
          setIsConnected(true);
          client.subscribe(`/topic/chatroom/${idRoom}`, () => {
            refetchMessage();
            refetch();
          });
          client.subscribe(`/topic/chatroom/${idRoom}/delete-message`, () => {
            refetchMessage();
            refetch();
          });
        },
        onStompError: frame => {
          console.error('STOMP Error:', frame.headers['message']);
          console.error('Details:', frame.body);
        },
        onDisconnect: () => {
          if(client !== null) {
            client.deactivate();
            setIsConnected(false);
          }
          console.log('disconnect');
          
        },
      });

      client.activate();
      return client;
    };

    const client = connectToWebSocket();

    return () => {
      if (client) {
        client.deactivate();
        setIsConnected(false);
      }

    };
  }, [refetch, idRoom]);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats]); // Run every time new messages are set

  const sendMessage = () => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: `/app/chatroom/${idRoom}`,
        body: JSON.stringify({
          chatRoomId: idRoom,
          senderId: idAccount,
          receiverId: receiverId,
          content: inputValue,
          referChatId: replyingTo?.id,
          chatType: 'TEXT',
        }),
      });
      setReplyingTo(null); // Clear the replyingTo state after sending the message
      setInputValue('');
      refetch();
    } else {
      console.error('STOMP client is not connected!');
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleDelete = async () => {
    try {
      await deleteOneMessage({ chatRoomId: idRoom, messageId: idDelete });
      setChats(prevChats => prevChats.filter(chat => chat.id !== idDelete));
      dispatch(setBackdrop(null));
      refetchMessage();
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const handleVideoCallBtn = () => {
    const data = encodeURIComponent(JSON.stringify({ userId: idAccount }));
    const windowFeatures = 'width=800,height=600,noopener,noreferrer';
    const url = `http://localhost:3000/portal/video-call?data=${data}`
    window.open(url, '_blank', windowFeatures);
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleImageSelect(file);
      }
    }
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const sendImage = () => {
    console.log('Starting image send process...');
    console.log('WebSocket status:', {
      hasStompClient: !!stompClient,
      isConnected: stompClient?.connected,
      hasSelectedImage: !!selectedImage,
      roomId: idRoom,
      senderId: idAccount,
      receiverId: receiverId
    });

    if (!stompClient) {
      console.error('STOMP client is not initialized');
      return;
    }

    if (!stompClient.connected) {
      console.error('STOMP client is not connected');
      return;
    }

    if (!selectedImage) {
      console.error('No image selected');
      return;
    }

    if (!idRoom || !idAccount || !receiverId) {
      console.error('Missing required data:', { idRoom, idAccount, receiverId });
      return;
    }

    try {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        try {
          const base64Image = reader.result as string;
          console.log('Image converted to base64, length:', base64Image.length);
          
          const message = {
            chatRoomId: idRoom,
            senderId: idAccount,
            receiverId: receiverId,
            content: base64Image,
            referChatId: replyingTo?.id,
            chatType: 'IMAGE'
          };
          
          console.log('Sending image message:', {
            destination: `/app/chatroom/${idRoom}`,
            messageType: 'IMAGE',
            contentLength: base64Image.length,
            message
          });

          stompClient.publish({
            destination: `/app/chatroom/${idRoom}`,
            body: JSON.stringify(message)
          });

          console.log('Image message sent successfully');
          setSelectedImage(null);
          setImagePreview(null);
          refetch();
        } catch (error) {
          console.error('Error in onloadend handler:', error);
        }
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };

      reader.readAsDataURL(selectedImage);
    } catch (error) {
      console.error('Error in sendImage:', error);
    }
  };

  const cancelImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
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
          <VideoCallIcon onClick = {handleVideoCallBtn}></VideoCallIcon>
        </div>
      </div>

      <div 
        className="relative h-full overflow-y-auto bg-gray-50"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="rounded-lg bg-white p-4 text-center">
              <p>Drop your image here</p>
            </div>
          </div>
        )}
        <div ref={scrollContainerRef} className="h-[90%] space-y-2 overflow-y-auto p-8">
          {chats.length > 0 ? (
            chats
              .slice()
              .reverse()
              .map((message, index) => (
                <div key={index}
                onTouchStart={handleTouchStart}
                onTouchEnd={(e) => handleTouchEnd(e, message)}
                >
                  <div
                    className={`flex w-full ${message.sender.id === idAccount ? 'justify-end' : ''}`}
                    onMouseEnter={() => setHoveredMessage(message.id)}
                    onMouseLeave={() => setHoveredMessage(null)}>
                    <div className={`flex max-w-[60%] ${message.sender.id === idAccount ? 'justify-end ' : ''}`}>
                      <div className="relative my-1 flex flex-col">
                        <div className="relative flex justify-center gap-5">
                          {/* Replied to message block */}
                          {message.referChat && (
                            <div className="mb-1 rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-600 shadow-inner">
                              Đang trả lời: {message.referChat.content}
                            </div>
                          )}
                          <div
                            className={`flex rounded-bl-lg rounded-br-lg px-4 py-2 shadow-lg ${
                              message.sender.id === idAccount ? ' justify-end rounded-tl-lg bg-[#246AA3] text-white' : 'rounded-tr-lg bg-white'
                            }`}>
                            <p>{message.content}</p>
                          </div>
                          {hoveredMessage === message.id && (
                            <div
                              className={`absolute flex flex-row flex-nowrap gap-1 ${
                                message.sender.id === idAccount ? 'right-full -translate-x-2' : 'left-full translate-x-2'
                              }`}>
                              {/* <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg">
                                <ReplyIcon style={{ width: '20px', height: '20px' }} />
                              </div> */}
                              {message.sender.id === idAccount && (
                                <div
                                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-lg shadow-lg"
                                  onClick={() => {
                                    dispatch(setBackdrop(BackdropType.AddModal));
                                    setIdDelete(message?.id);
                                  }}>
                                  <Tooltip title="Xóa tin nhắn" placement="top">
                                    <DeleteOutlineOutlinedIcon style={{ width: '20px', height: '20px' }} />
                                  </Tooltip>
                                </div>
                              )}
                              <div
                                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-lg shadow-lg"
                                  onClick={() => {
                                    setIdReplyMes(message?.id);//set id reply message
                                    setReplyingTo(message);
                                    setInputValue(`@${message?.content} `); // pre-fill the reply
                                  }}>
                                  <Tooltip title="Rep tin nhắn" placement="top">
                                    <ReplyIcon style={{ width: '20px', height: '20px' }} />
                                  </Tooltip>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className={`flex items-center ${message.sender.id === idAccount ? 'justify-end' : 'justify-start'} gap-2`}>
                          <p className={`${message.sender.id === idAccount ? 'text-right' : 'text-left'} mt-1 text-xs text-[#4B465C]`}>
                            {formatDistanceToNow(new Date(message?.createAt), { addSuffix: true, locale: vi })}
                          </p>
                          <p className={`${message.sender.id === idAccount ? 'text-right' : 'text-left'} mt-1 text-xs text-[#4B465C]`}>Đã xem</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {showBackdrop === BackdropType.AddModal && (
                    <PopupConfirmAction name="" text="Bạn có chắc chắn muốn xóa không" onClick={() => handleDelete()} />
                  )}
                </div>
              ))
          ) : (
            <p className="text-center">Hãy bắt đầu cuộc trò chuyện bằng một lời chào 😍</p>
          )}
        <div ref={bottomRef}></div>
        </div>
        {replyingTo && (
      <div className="px-4 py-2 text-sm bg-gray-200 border-b">
        <span>Đang trả lời: </span>
        <strong>{replyingTo?.content}</strong>
        <button onClick={() => setReplyingTo(null)} className="ml-2 text-red-500">Hủy</button>
      </div>
    )}
        {imagePreview && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 transform rounded-lg bg-white p-4 shadow-lg">
            <img src={imagePreview} alt="Preview" className="max-h-40 rounded" />
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={cancelImage}
                className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={sendImage}
                className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                disabled={!stompClient?.connected}
              >
                {stompClient?.connected ? 'Send' : 'Connecting...'}
              </button>
            </div>
          </div>
        )}
        <div
          className={`${
            !idRoom ? 'cursor-not-allowed opacity-50' : ''
          } absolute bottom-5 left-1/2 flex w-[96%] -translate-x-1/2 transform items-center rounded-lg bg-white shadow-md`}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="image/*"
            className="hidden"
          />
          <IconButton 
            disabled={!idRoom} 
            className="!p-2" 
            onClick={handleImageClick}
          >
            <ImageIcon className="text-primary-main" fontSize="medium" />
          </IconButton>
          <textarea
            name=""
            id=""
            disabled={!idRoom}
            value={inputValue}
            onKeyDown={handleKeyDown}
            onChange={e => setInputValue(e.target.value)}
            className="h-5 w-full border-none focus:outline-none"
            style={{ boxShadow: 'none' }}
          />
          <IconButton disabled={!idRoom} className="!p-2" onClick={sendMessage}>
            <SendIcon className="text-primary-main" fontSize="medium" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ChatRight;
