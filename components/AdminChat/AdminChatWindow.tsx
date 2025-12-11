"use client";
import React, { useEffect, useRef, useState } from "react";
import MessageList from "@/components/Chat/MessageList";
import MessageInput from "@/components/Chat/MessageInput";

type Message = {
  id: string;
  roomId: string;
  senderId: string;
  type: string;
  content: string;
  createdAt: string;
};

export default function AdminChatWindow({
  socket,
  roomId,
  currentAdminId,
  userInfo,
}: {
  socket: any;
  roomId: string | null;
  currentAdminId: string;
  userInfo?: { name: string; email: string; isOnline: boolean };
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/rooms/${roomId}/messages`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data?.success) setMessages(data.data || []);
      } catch (e) {
        console.error("[AdminChatWindow] fetch messages failed", e);
      }
    })();

    const handleReceive = (msg: Message) => {
      setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
    };

    const handleMessageSent = ({ message, tempId }: any) => {
      setMessages((prev) => {
        if (tempId) {
          const mapped = prev.map((m) => (m.id === tempId ? message : m));
          if (!mapped.some((m) => m.id === message.id)) mapped.push(message);
          return mapped;
        }
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    };

    const handleTyping = (data: { userId: string; isTyping: boolean }) => {
      setTypingUsers((prev) => {
        if (data.isTyping) return Array.from(new Set([...prev, data.userId]));
        return prev.filter((id) => id !== data.userId);
      });
    };

    socketRef.on("receive_message", handleReceive);
    socketRef.on("message_sent", handleMessageSent);
    socketRef.on("typing", handleTyping);

    return () => {
      if (!socket?.current) return;
      socket.current.off("receive_message", handleReceive);
      socket.current.off("message_sent", handleMessageSent);
      socket.current.off("typing", handleTyping);
      socket.current.emit("leave_room", { roomId });
    };
  }, [roomId, socket]);

  if (!roomId)
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-white">
        <svg
          className="w-24 h-24 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p className="text-lg font-medium">Select a conversation</p>
        <p className="text-sm text-gray-400 mt-1">Choose a chat from the list to start messaging</p>
      </div>
    );

  return (
    <div className="flex-1 flex flex-col ml-80 relative bg-white">
      {/* Chat Header */}
      <div className="bg-[#310101] text-white px-6 py-4 border-b-2 border-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-white text-[#310101] flex items-center justify-center font-bold text-lg">
              {userInfo?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            {userInfo?.isOnline && (
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-[#310101]"></span>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-lg">{userInfo?.name || "User"}</h2>
            <p className="text-sm text-gray-300">
              {userInfo?.isOnline ? "Online" : "Offline"} • {userInfo?.email || ""}
            </p>
          </div>
        </div>

        {/* Typing Indicator in Header */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <div className="flex gap-1">
              <span
                className="w-2 h-2 bg-white animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></span>
              <span
                className="w-2 h-2 bg-white animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></span>
              <span
                className="w-2 h-2 bg-white animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></span>
            </div>
            <span>User is typing...</span>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-white scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-200">
        <MessageList messages={messages} currentUserId={currentAdminId} typingUsers={typingUsers} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t-2 border-[#310101] p-4">
        <MessageInput socket={socket} roomId={roomId} />
      </div>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #e5e7eb;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #4b5563;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #374151;
        }
      `}</style>
    </div>
  );
}