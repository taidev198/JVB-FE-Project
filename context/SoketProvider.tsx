import React, { createContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppSelector } from '@/store/hooks';

export const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const idAccount = useAppSelector(state => state.user.idAccount);
  const token = useAppSelector(state => state.user?.token);
  const wsUrl = `ws://localhost:8082/ws/raw/notifications?accountId=${idAccount}`;

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!token) {
      // Nếu không có token, đóng kết nối WebSocket
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Nếu có token, kết nối lại WebSocket
    if (wsUrl && token) {
      let ws: WebSocket;
      let reconnectTimeout: NodeJS.Timeout;
      let heartbeatInterval: NodeJS.Timeout;
      // console.log('Kết nối socket thành công');
      const connectWebSocket = () => {
        ws = new WebSocket(wsUrl);
        ws.onopen = () => {
          setIsConnected(true);
          setSocket(ws);

          // Bắt đầu gửi heartbeat
          heartbeatInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'ping' })); // Gửi tín hiệu ping
            }
          }, 30000);
        };

        ws.onmessage = event => {
          const rawMessage = event.data;
          const titleMatch = rawMessage.match(/notificationTitle=(.*?)(,|$)/);
          const notificationTitle = titleMatch ? titleMatch[1] : 'Không tìm thấy tiêu đề';
          setMessages(prevMessages => [...prevMessages, rawMessage]);

          // Hiển thị thông báo
          toast(notificationTitle, {
            icon: '🔔',
          });
        };

        ws.onerror = error => {
          console.error('Lỗi WebSocket:', error);
          setIsConnected(false);
        };

        ws.onclose = () => {
          ws.close();
          setIsConnected(false);
          clearInterval(heartbeatInterval); // Dừng gửi heartbeat
        };
      };

      connectWebSocket();

      return () => {
        clearTimeout(reconnectTimeout);
        clearInterval(heartbeatInterval);
      };
    }
  }, [token, wsUrl]);

  // Hàm thủ công để làm mới kết nối
  const reconnectSocket = () => {
    if (socket) {
      socket.close(); // Đóng kết nối hiện tại
    }
    setSocket(null);
    setIsConnected(false);
  };

  return <SocketContext.Provider value={{ socket, isConnected, messages, reconnectSocket }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
