// context/SocketContext.js
import React, { createContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppSelector } from '@/store/hooks';

export const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const idAccount = useAppSelector(state => state.user.user?.account?.id);

  const wsUrl = `ws://192.168.0.152:8082/ws/notifications?accountId=${idAccount}`;
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = event => {
      const rawMessage = event.data;
      console.log(rawMessage);

      const titleMatch = rawMessage.match(/notificationTitle=(.*?)(,|$)/);
      const notificationTitle = titleMatch ? titleMatch[1] : 'Không tìm thấy tiêu đề';
      setMessages(prevMessages => [...prevMessages, rawMessage]);
      toast(notificationTitle, {
        icon: '🔔',
      });
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [wsUrl]);

  return <SocketContext.Provider value={{ socket, isConnected, messages }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
