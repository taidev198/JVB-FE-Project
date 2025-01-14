import { Client, Stomp } from '@stomp/stompjs'; // Import Client from modern stompjs
import SockJS from 'sockjs-client'; // Import SockJS for WebSocket fallback
import { useState, useEffect } from 'react';
import { useGetAllChatRoomQuery, useGetAllMessageInAChatRoomQuery, useCreateChatRoomMutation } from '@/services/adminSchoolApi';

const ChatPage = () => {
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState({});
  const [currentChatRoom, setCurrentChatRoom] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [chatRoomId, setChatRoomId] = useState(null);
  const { data: chatRoom, refetch: refetchChatRooms } = useGetAllChatRoomQuery({ userId: 10 });
  const { data: chat } = useGetAllMessageInAChatRoomQuery({ chatRoomId: chatRoomId });

  const [createChatRoom] = useCreateChatRoomMutation(); // Mutation to create a new chat room

  const subscribeToChatRoom = (client, chatRoomId) => {
    console.log('chatroom ' + chatRoom);

    client.subscribe(`/topic/chatroom/${chatRoomId}`, message => {
      const parsedMessage = JSON.parse(message.body);
      console.log(`Message received in Chat Room ${chatRoomId}:`, parsedMessage);

      setMessages(prevMessages => ({
        ...prevMessages,
        [chatRoomId]: [...(prevMessages[chatRoomId] || []), parsedMessage],
      }));
    });
  };

  useEffect(() => {
    const connectToWebSocket = (url, onConnect, onError) => {
      const client = new Client({
        webSocketFactory: () => new SockJS(url),
        onConnect: () => {
          console.log('Connected to WebSocket');
          if (onConnect) onConnect(client);
        },
        onStompError: frame => {
          console.error('Broker reported error:', frame.headers['message']);
          console.error('Details:', frame.body);
          if (onError) onError(frame);
        },
        onWebSocketClose: event => {
          console.log('WebSocket closed:', event);
        },
      });

      client.activate();
      return client;
    };

    const client = connectToWebSocket(
      'http://localhost:8082/ws',
      client => {
        setStompClient(client);

        // Subscribe to all existing chat rooms
        (chatRoom?.data || []).forEach(room => {
          subscribeToChatRoom(client, room.id);
        });

        // Subscribe to new chat room notifications
        client.subscribe('/topic/new-chatroom', message => {
          console.log('subscribe to new chatroom: ');

          const newChatRoom = JSON.parse(message.body);
          console.log('New chat room received:', newChatRoom);

          // Refetch the chat rooms to update the list
          refetchChatRooms();

          // Automatically subscribe to the new chat room
          subscribeToChatRoom(client, newChatRoom.id);
        });
      },
      error => {
        console.error('WebSocket error:', error);
      }
    );

    return () => {
      if (client) client.deactivate();
    };
  }, [chatRoom]);

  useEffect(() => {
    console.log(chat);
  }, [currentChatRoom]);

  const sendMessage = (chatRoomId, content) => {
    if (stompClient && chatRoomId) {
      console.log('chatroomId ' + chatRoomId);

      stompClient.publish({
        destination: `/app/chatroom/${chatRoomId}`,
        body: JSON.stringify({
          chatRoomId,
          senderId: 11, // Replace with dynamic user ID
          receiverId: 21, // Replace with dynamic recipient ID
          content,
          chatType: 'TEXT',
        }),
      });

      setMessageInput('');
    }
  };

  const handleCreateNewChatRoom = async () => {
    try {
      const response = await createChatRoom({ ownerId: 10, memberId: 11 }).unwrap(); // Replace with dynamic IDs
      console.log('Chat room created:', response);

      // Refetch chat rooms to update the UI
      refetchChatRooms();
    } catch (error) {
      console.error('Error creating chat room:', error);
    }
  };

  return (
    <div>
      <h1>Chat Application</h1>

      <div style={{ display: 'flex' }}>
        <div style={{ width: '30%' }}>
          <h2>Chat Rooms</h2>
          <button onClick={handleCreateNewChatRoom} style={{ marginBottom: '10px' }}>
            Create New Chat Room
          </button>
          {(chatRoom?.data || []).map(chatRoomItem => (
            <button
              key={chatRoomItem.id}
              onClick={() => {
                setChatRoomId(chatRoomItem.id);
                setCurrentChatRoom(chatRoomItem.id);
              }}
              style={{
                display: 'block',
                marginBottom: '10px',
                backgroundColor: currentChatRoom === chatRoomItem.id ? '#ddd' : '#fff',
              }}>
              Chat Room {chatRoomItem.id}
            </button>
          ))}
        </div>

        <div style={{ width: '70%', marginLeft: '20px' }}>
          <h2>Chat Room {currentChatRoom}</h2>

          <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
            {currentChatRoom &&
              (messages[currentChatRoom] || []).map((msg, index) => (
                <div key={index}>
                  <strong>User {msg.senderId}: </strong>
                  {msg.content}
                </div>
              ))}
          </div>

          <div style={{ marginTop: '10px' }}>
            <input type="text" value={messageInput} onChange={e => setMessageInput(e.target.value)} placeholder="Type a message" style={{ width: '80%' }} />
            <button onClick={() => sendMessage(currentChatRoom, messageInput)}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
