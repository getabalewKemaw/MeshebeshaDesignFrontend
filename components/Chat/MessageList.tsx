"use client";
import React, { useEffect, useRef } from 'react';

type Message = {
  id: string;
  roomId: string;
  senderId: string;
  type: string;
  content: string;
  createdAt: string;
};

export default function MessageList({ messages, currentUserId }: { messages: Message[]; currentUserId: string }) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="overflow-auto p-2 flex-1">
      {messages.map((m) => (
        <div key={m.id} className={`my-2 flex ${m.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[70%] p-2 rounded-md ${m.senderId === currentUserId ? 'bg-sky-600 text-white' : 'bg-gray-100'}`}>
            {m.type === 'text' && <div>{m.content}</div>}
            {m.type === 'image' && <img src={m.content} alt="image" className="max-h-48 object-contain" />}
            {m.type === 'voice' && (
              <audio controls src={m.content} />
            )}
            <div className="text-xs text-gray-400 mt-1">{new Date(m.createdAt).toLocaleString()}</div>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
