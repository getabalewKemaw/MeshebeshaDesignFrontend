"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useSocket } from '@/components/Chat/useSocket';
import MessageList from '@/components/Chat/MessageList';
import MessageInput from '@/components/Chat/MessageInput';
import axios from 'axios';

type Message = {
  id: string;
  roomId: string;
  senderId: string;
  type: string;
  content: string;
  createdAt: string;
};

export default function ChatClient({ productId }: { productId: string }) {
  const { user } = useAuth();
  const socketRef = useSocket();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!user) return;

    // Create or get room for this product
    (async () => {
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/chat/rooms`, { productId }, { withCredentials: true });
        const room = res.data?.data;
        setRoomId(room.id);
      } catch (err) {
        console.error('Create room error', err);
      }
    })();
  }, [user, productId]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !roomId) return;

    // Join room
    socket.emit('join_room', { roomId });
    console.log('[ChatClient] emit join_room', { roomId });

    const onReceive = (msg: Message) => {
      console.log('[ChatClient] receive_message', msg);
      setMessages((m) => [...m, msg]);
    };

    const onMessageSent = (payload: any) => {
      console.log('[ChatClient] message_sent ack', payload);
      const { message, tempId } = payload;
      if (tempId) {
        // Replace optimistic message with server message
        setMessages((m) => {
          const idx = m.findIndex((x: any) => x.id === tempId);
          if (idx !== -1) {
            const copy = [...m];
            copy[idx] = message;
            return copy;
          }
          return [...m, message];
        });
      } else {
        setMessages((m) => [...m, message]);
      }
    };

    const onTyping = (data: any) => {
      // could show typing indicator
    };

    socket.on('receive_message', onReceive);
    socket.on('message_sent', onMessageSent);
    socket.on('typing', onTyping);

    // Load history
    (async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/chat/rooms/${roomId}/messages`, { withCredentials: true });
        setMessages(res.data?.data || []);
      } catch (err) {
        console.error('Load messages error', err);
      }
    })();

    return () => {
      socket.off('receive_message', onReceive);
      socket.off('message_sent', onMessageSent);
      socket.off('typing', onTyping);
    };
  }, [socketRef, roomId]);

  const onSendLocal = (msg: any) => {
    setMessages((m) => [...m, msg]);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <MessageList messages={messages} currentUserId={user?.id || 'me'} />
      </div>
      {roomId && <MessageInput socket={socketRef} roomId={roomId} onSend={onSendLocal} />}
    </div>
  );
}
