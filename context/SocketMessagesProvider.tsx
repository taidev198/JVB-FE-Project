import { createContext, useContext, useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const SocketContext = createContext(null);

export const useSocketContext = () => {
  return useContext(SocketContext);
};

const SocketMessagesProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${process.env.NEXT_PUBLIC_API_URL_CHAT}/ws/stomp`),
      onConnect: () => {},
      onStompError: frame => {
        console.error('❌ STOMP Error:', frame.headers['message']);
        console.error('Details:', frame.body);
      },
      onWebSocketClose: () => {},
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, []);

  return <SocketContext.Provider value={{ stompClient }}>{children}</SocketContext.Provider>;
};

export default SocketMessagesProvider;
