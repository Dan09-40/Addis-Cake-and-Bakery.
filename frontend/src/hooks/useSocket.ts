import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const useSocket = (room: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    socketRef.current.on('connect', () => {
      console.log('🔌 Connected to socket server');
      // Join the appropriate room based on role
      if (room) {
        socketRef.current?.emit('join_room', room);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [room]);

  return socketRef;
};

export default useSocket;
