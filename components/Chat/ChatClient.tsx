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

  // Create/get room as soon as user available
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

  // Socket events
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !roomId) return;

    // join
    socket.emit("join_room", { roomId });

    // handlers
    const handleReceive = (msg: Message) => {
      setMessages(prev => (prev.some(m => m.id === msg.id) ? prev : [...prev, msg]));
    };

    const handleMessageSent = (payload: any) => {
      // payload: { message, tempId }
      const { message, tempId } = payload;
      setMessages(prev => {
        // replace temp or add if not present
        if (tempId) {
          const replaced = prev.map(m => (m.id === tempId ? message : m));
          if (!replaced.some(m => m.id === message.id)) replaced.push(message);
          return replaced;
        }
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
    };

    const handleTyping = (data: { userId: string; isTyping: boolean }) => {
      setTypingUsers(prev => {
        if (data.isTyping) return Array.from(new Set([...prev, data.userId]));
        return prev.filter(id => id !== data.userId);
      });
    };

    socket.on("receive_message", handleReceive);
    socket.on("message_sent", handleMessageSent);
    socket.on("typing", handleTyping);

    // load history
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
      if (!socketRef.current) return;
      socketRef.current.off("receive_message", handleReceive);
      socketRef.current.off("message_sent", handleMessageSent);
      socketRef.current.off("typing", handleTyping);
      socketRef.current.emit("leave_room", { roomId });
    };
  }, [socketRef, roomId]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <MessageList messages={messages} currentUserId={user?.id || "me"} typingUsers={typingUsers} />
      </div>
      {roomId && <MessageInput socket={socketRef} roomId={roomId} />}
    </div>
  );
}
