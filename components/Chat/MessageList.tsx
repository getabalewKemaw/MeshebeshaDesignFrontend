"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
type Message = {
  id: string;
  roomId: string;
  senderId: string;
  type: string;
  content: string;
  createdAt: string;
};

export default function MessageList({
  messages,
  currentUserId,
  typingUsers = []
}: {
  messages: Message[];
  currentUserId: string;
  typingUsers?: string[];
}) {
  
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  return (
    <div className="flex flex-col gap-2 p-2 overflow-y-auto h-full bg-gray-50">

      {messages.map((msg) => {
        const isMine = msg.senderId === currentUserId;

        return (
          <div
            key={msg.id}
            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`
                max-w-[60%] p-3 rounded-xl shadow
                ${isMine
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 border rounded-bl-none"}
              `}
            >
              {/* Message content depending on type */}
              {msg.type === "text" && <p>{msg.content}</p>}

              {msg.type === "image" && (
                <Image  width={200} height={200}
                  src={msg.content}
                  alt="Image"
                  className="rounded-lg max-h-64 object-cover"
                />
              )}

              {msg.type === "voice" && (
                <audio controls className="w-full">
                  <source src={msg.content} />
                </audio>
              )}

              {msg.type === "video" && (
                <video controls className="rounded-lg max-h-80">
                  <source src={msg.content} />
                </video>
              )}

              <span className="text-xs opacity-50 block text-right mt-1">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        );
      })}

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="text-sm text-gray-500 animate-pulse pl-2">
          Someone is typing...
        </div>
      )}

      <div ref={bottomRef}></div>
    </div>
  );
}
