"use client";
import React, { useEffect, useState } from "react";
import MessageList from "@/components/Chat/MessageList";
import MessageInput from "@/components/Chat/MessageInput";

type Message = { id: string; roomId: string; senderId: string; type: string; content: string; createdAt: string; };

export default function AdminChatWindow({ socket, roomId, currentAdminId }: { socket: any; roomId: string | null; currentAdminId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);

  // Load room messages and subscribe to socket events
  useEffect(() => {
    if (!roomId || !socket?.current) return;

    // Fetch room history
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/rooms/${roomId}/messages`, { credentials: "include" });
        const data = await res.json();
        if (data?.success) setMessages(data.data || []);
      } catch (e) {
        console.error("[AdminChatWindow] fetch messages failed", e);
      }
    })();

    // Join room
    socket.current.emit("join_room", { roomId });

    // Handlers
    const handleReceive = (msg: Message) => setMessages((prev) => [...prev, msg]);
    const handleSent = (payload: any) => {
      const { message, tempId } = payload;
      if (tempId) {
        setMessages((prev) => prev.map((m) => (m.id === tempId ? message : m)).concat(!prev.some((m) => m.id === message.id) ? [message] : []));
      } else setMessages((prev) => [...prev, message]);
    };

    socket.current.on("receive_message", handleReceive);
    socket.current.on("message_sent", handleSent);

return () => {
  if (socket.current) {
    socket.current.off("receive_message", handleReceive);
    socket.current.off("message_sent", handleSent);
    socket.current.emit("leave_room", { roomId });
  }
};

  }, [roomId, socket]);

  const handleSendLocal = (msg: any) => setMessages((prev) => [...prev, msg]);

  if (!roomId) return <div className="flex-1 flex items-center justify-center text-gray-500">Select a conversation</div>;

  return (
    <div className="flex-1 flex flex-col">
      <MessageList messages={messages} currentUserId={currentAdminId} />
      <MessageInput socket={socket} roomId={roomId} onSend={handleSendLocal} />
    </div>
  );
}
