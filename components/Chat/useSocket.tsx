"use client";
import { io, Socket } from 'socket.io-client';
import { useEffect, useRef } from 'react';

export function useSocket(connectWhen = false) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!connectWhen) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000', {
      transports: ['websocket'],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected', socket.id);
    });

    socket.on('connect_error', (err: any) => {
      console.error('Socket connect error', err);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [connectWhen]);

  return socketRef;
}
