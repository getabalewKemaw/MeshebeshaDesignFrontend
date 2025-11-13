"use client";
import React, { useEffect, useState } from 'react';
import MessageList from '@/components/Chat/MessageList';
import MessageInput from '@/components/Chat/MessageInput';

type Message = {
  id: string;
  roomId: string;
  senderId: string;
  type: string;
  content: string;
  createdAt: string;
};

export default function AdminChatWindow({ socket, roomId, currentAdminId }: { socket: any; roomId: string | null; currentAdminId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!roomId) return;

    // Fetch history (include credentials so server can authenticate)
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/chat/rooms/${roomId}/messages`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data?.success) setMessages(data.data || []);
      } catch (e) {
        console.error('Failed to load messages', e);
      }
    })();

    // Join room via socket (so admin receives live messages)
    socket?.current?.emit('join_room', { roomId });
    console.log('[AdminChatWindow] emit join_room', { roomId });

    const onReceive = (msg: Message) => {
      console.log('[AdminChatWindow] receive_message', msg);
      setMessages((s) => [...s, msg]);
    };

    const onMessageSent = (payload: any) => {
      console.log('[AdminChatWindow] message_sent ack', payload);
      const { message, tempId } = payload;
      if (tempId) {
        setMessages((s) => {
          const idx = s.findIndex((x: any) => x.id === tempId);
          if (idx !== -1) {
            const copy = [...s];
            copy[idx] = message;
            return copy;
          }
          return [...s, message];
        });
      } else {
        setMessages((s) => [...s, message]);
      }
    };

    socket?.current?.on('receive_message', onReceive);
    socket?.current?.on('message_sent', onMessageSent);

    return () => {
      socket?.current?.off('receive_message', onReceive);
      socket?.current?.off('message_sent', onMessageSent);
      if (roomId) socket?.current?.emit('leave_room', { roomId });
    };
  }, [roomId, socket]);

  const handleSendLocal = (msg: any) => {
    // optimistic update already handled by MessageInput; but ensure we add to list
    setMessages((s) => [...s, { ...msg }]);
  };

  if (!roomId) return <div className="flex-1 flex items-center justify-center text-gray-500">Select a conversation</div>;

  return (
    <div className="flex-1 flex flex-col">
      <MessageList messages={messages} currentUserId={currentAdminId} />
      <MessageInput socket={socket} roomId={roomId} onSend={handleSendLocal} />
    </div>
  );
}
