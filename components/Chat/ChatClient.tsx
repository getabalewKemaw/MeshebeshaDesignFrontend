"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useSocket } from "./useSocket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import axios from "axios";

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
  const socketRef = useSocket(!!user);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Create or get room
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/rooms`,
          { productId },
          { withCredentials: true }
        );
        setRoomId(res.data?.data?.id);
      } catch (err) {
        console.error("[ChatClient] create room error", err);
      }
    })();
  }, [user, productId]);

  // Handle socket events
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !roomId) return;

    socket.emit("join_room", { roomId });
    console.log("[ChatClient] join_room", { roomId });

    const handleReceive = (msg: Message) => setMessages((prev) => [...prev, msg]);
    const handleSent = (payload: any) => {
      const { message, tempId } = payload;
      if (tempId) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? message : m)).concat(!prev.some((m) => m.id === message.id) ? [message] : [])
        );
      } else setMessages((prev) => [...prev, message]);
    };

    const handleTyping = (data: { userId: string; isTyping: boolean }) => {
      setTypingUsers((prev) => {
        if (data.isTyping) return [...new Set([...prev, data.userId])];
        return prev.filter((id) => id !== data.userId);
      });
    };

    socket.on("receive_message", handleReceive);
    socket.on("message_sent", handleSent);
    socket.on("typing", handleTyping);

    // Load initial messages
    (async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/rooms/${roomId}/messages`,
          { withCredentials: true }
        );
        setMessages(res.data?.data || []);
      } catch (err) {
        console.error("[ChatClient] load messages error", err);
      }
    })();

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("message_sent", handleSent);
      socket.off("typing", handleTyping);
    };
  }, [socketRef, roomId]);

  const sendLocal = (msg: Message) => setMessages((prev) => [...prev, msg]);

  const MessageListAny = MessageList as any;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <MessageListAny messages={messages} currentUserId={user?.id || "me"} typingUsers={typingUsers} />
      </div>
      {roomId && <MessageInput socket={socketRef} roomId={roomId} onSend={sendLocal} />}
    </div>
  );
}
