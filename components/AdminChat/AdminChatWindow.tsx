"use client";
import React, { useEffect, useRef, useState } from "react";
import MessageList from "@/components/Chat/MessageList";
import MessageInput from "@/components/Chat/MessageInput";

type Message = { id: string; roomId: string; senderId: string; type: string; content: string; createdAt: string; };

export default function AdminChatWindow({ socket, roomId, currentAdminId }: { socket: any; roomId: string | null; currentAdminId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const prevRoom = useRef<string | null>(null);

  useEffect(() => {
    const socketRef = socket?.current;
    if (!roomId || !socketRef) return;

    // leave previous room if any
    if (prevRoom.current && prevRoom.current !== roomId) {
      socketRef.emit("leave_room", { roomId: prevRoom.current });
    }
    prevRoom.current = roomId;

    socketRef.emit("join_room", { roomId });

    // load history
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/rooms/${roomId}/messages`, { credentials: "include" });
        const data = await res.json();
        if (data?.success) setMessages(data.data || []);
      } catch (e) {
        console.error("[AdminChatWindow] fetch messages failed", e);
      }
    })();

    const handleReceive = (msg: Message) => {
      setMessages(prev => (prev.some(m => m.id === msg.id) ? prev : [...prev, msg]));
    };
    const handleMessageSent = ({ message, tempId }: any) => {
      setMessages(prev => {
        if (tempId) {
          const mapped = prev.map(m => (m.id === tempId ? message : m));
          if (!mapped.some(m => m.id === message.id)) mapped.push(message);
          return mapped;
        }
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
    };

    socketRef.on("receive_message", handleReceive);
    socketRef.on("message_sent", handleMessageSent);

    return () => {
      if (!socket?.current) return;
      socket.current.off("receive_message", handleReceive);
      socket.current.off("message_sent", handleMessageSent);
      socket.current.emit("leave_room", { roomId });
    };
  }, [roomId, socket]);

  if (!roomId) return <div className="flex-1 flex items-center justify-center text-gray-500">Select a conversation</div>;

return (
  <div className="flex-1 flex flex-col ml-80 relative">

    <div className="flex-1 overflow-auto p-4 pb-28 bg-gray-50">
      <MessageList messages={messages} currentUserId={currentAdminId} />
    </div>

<div className="fixed bottom-20 right-0 left-80 bg-black border-t p-2 z-50">
  <MessageInput socket={socket} roomId={roomId} />
</div>


  </div>
);

}