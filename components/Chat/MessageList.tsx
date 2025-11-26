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
  sender?: { id: string; name: string; email: string };
};

export default function MessageList({
  messages,
  currentUserId,
  typingUsers = [],
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
    <div className="flex flex-col gap-3">
      {messages.map((msg) => {
        const isMine = msg.senderId === currentUserId;

        return (
          <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
            <div
              className={`
                max-w-[70%] px-4 py-3 border transition-all duration-200
                ${isMine
                  ? "bg-[#1E2A55] text-white border-[#1E2A55]"
                  : "bg-white text-gray-800 border-gray-300"
                }
              `}
            >
              {/* Sender name for received messages */}
              {!isMine && msg.sender && (
                <p className="text-xs font-semibold text-gray-600 mb-1">{msg.sender.name}</p>
              )}

              {/* Message content depending on type */}
              {msg.type === "text" && <p className="text-sm break-words leading-relaxed">{msg.content}</p>}

              {msg.type === "image" && (
                <Image
                  width={300}
                  height={300}
                  src={msg.content}
                  alt="Image"
                  className="max-h-64 object-cover cursor-pointer"
                />
              )}

              {msg.type === "voice" && (
                <audio controls className="w-full max-w-xs">
                  <source src={msg.content} />
                </audio>
              )}

              {msg.type === "video" && (
                <video controls className="max-h-80 max-w-md">
                  <source src={msg.content} />
                </video>
              )}

              {/* Timestamp */}
              <span
                className={`text-xs mt-1.5 block text-right ${isMine ? "text-gray-300" : "text-gray-500"
                  }`}
              >
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef}></div>
    </div>
  );
}