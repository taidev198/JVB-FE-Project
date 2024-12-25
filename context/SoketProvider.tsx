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
    if (!wsUrl) return;

    let ws;
    let reconnectTimeout;
    let heartbeatInterval;

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
        setIsConnected(false);
        clearInterval(heartbeatInterval); // Dừng gửi heartbeat
        reconnectTimeout = setTimeout(connectWebSocket, 1000); // Kết nối lại sau 5 giây
      };
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
      clearTimeout(reconnectTimeout);
      clearInterval(heartbeatInterval);
    };
  }, [wsUrl]);

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
