"use client";
import React from 'react';

type RoomSummary = {
  id: string;
  product: { id: string; title: string } | null;
  user: { id: string; name: string; email?: string } | null;
  lastMessage?: { id: string; content: string; type: string; createdAt: string } | null;
  createdAt: string;
};

export default function AdminChatList({ rooms, onSelect }: { rooms: RoomSummary[]; onSelect: (id: string) => void }) {
  return (
    <div className="w-80 bg-white border-r overflow-y-auto fixed left-0 top-0 bottom-0">
      <div className="p-4 border-b font-semibold">Conversations</div>
      <ul>
        {rooms.map((r) => (
          <li key={r.id} className="p-3 border-b hover:bg-gray-50 cursor-pointer" onClick={() => onSelect(r.id)}>
            <div className="text-sm font-medium">{r.user?.name ?? 'Unknown user'}</div>
            <div className="text-xs text-black">{r.product?.title ?? 'Product'}</div>
            <div className="text-xs text-black truncate">{r.lastMessage ? `${r.lastMessage.type === 'text' ? r.lastMessage.content : '[' + r.lastMessage.type + ']'}` : 'No messages yet'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}