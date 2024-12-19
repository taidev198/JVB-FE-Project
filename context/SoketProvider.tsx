/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { io } from 'socket.io-client';

// Tạo socket instance
export const socket = io('localhost:8082/ws', {
  autoConnect: true,
  path: '/notifications',
  query: {
    accountId: '3',
  },
});

// Định nghĩa kiểu cho context
type SocketContextType = {
  socket: typeof socket;
};

// Tạo context với giá trị mặc định là null
const SocketContext = createContext<SocketContextType | null>(null);

// Custom hook sử dụng context
export const useModalContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useModalContext must be used within a SocketProvider');
  }
  return context;
};

// Provider
const SocketProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    // Lắng nghe các sự kiện
    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected to socket server');
    });

    // Clean-up
    return () => {
      socket.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
