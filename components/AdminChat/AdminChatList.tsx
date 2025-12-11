"use client";
import React, { useState } from "react";
import Image from 'next/image';
import { p } from "framer-motion/client";


type RoomSummary = {
  id: string;
  product: { id: string; title: string } | null;
  user: { id: string; name: string; email?: string, image?: string } | null;
  lastMessage?: { id: string; content: string; type: string; createdAt: string } | null;
  createdAt: string;
};

export default function AdminChatList({
  rooms,
  onSelect,
  selectedRoomId,
  onlineUsers,
}: {
  rooms: RoomSummary[];
  onSelect: (id: string, userInfo: any) => void;
  selectedRoomId: string | null;
  onlineUsers: Set<string>;
}) {

  
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = rooms.filter((room) => {
    const userName = room.user?.name?.toLowerCase() || "";
    const productTitle = room.product?.title?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return userName.includes(query) || productTitle.includes(query);
  });

  return (
    <div className="w-80 bg-white border-r-2 border-[#310101] overflow-y-auto fixed left-0 top-10 bottom-0 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-200">
      {/* Header */}
      <div className="bg-[#310101] text-white p-4 border-b-2 border-white">
        <h2 className="text-xl font-bold mb-3">Conversations</h2>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full px-3 py-2 bg-white text-black border border-gray-300 focus:outline-none focus:border-gray-600 text-sm"
          />
          <svg
            className="absolute right-3 top-2.5 w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Conversations List */}
      <div className="divide-y divide-gray-200">
        {filteredRooms.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg
              className="w-16 h-16 mx-auto mb-3 text-gray-300"
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
            <p className="text-sm">No conversations found</p>
          </div>
        ) : (
          filteredRooms.map((r) => {
            const isOnline = r.user?.id ? onlineUsers.has(r.user.id) : false;
            const isSelected = r.id === selectedRoomId;

            return (
              <div
                key={r.id}
                className={`p-4 hover:bg-gray-100 cursor-pointer transition-colors border-l-4 ${isSelected ? "bg-gray-100 border-l-[#310101]" : "border-l-transparent"
                  }`}
                onClick={() =>
                  onSelect(r.id, {
                    name: r.user?.name || "Unknown User",
                    email: r.user?.email || "",
                    isOnline,
                  })
                }
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#310101] flex items-center justify-center font-bold text-lg">
                      {r.user?.image ? (
                        <Image
                          src={r.user.image}
                          alt={`${r.user.name}'s avatar`}
                          fill
                          className="object-cover rounded-full"
                        />
                      ) : (
                        <p className="text-white ">  {r.user?.name?.charAt(0).toUpperCase() || "U"}</p>

                      )}
                    </div>

                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white"></span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {r.user?.name ?? "Unknown user"}
                      </h3>
                      {r.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {new Date(r.lastMessage.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>

                    {r.product && (
                      <p className="text-xs text-gray-600 mb-1 truncate flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                        {r.product.title}
                      </p>
                    )}

                    <p className="text-sm text-gray-600 truncate">
                      {r.lastMessage ? (
                        <>
                          {r.lastMessage.type === "text" ? (
                            r.lastMessage.content
                          ) : (
                            <span className="flex items-center gap-1 text-gray-500">
                              {r.lastMessage.type === "image" && (
                                <>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                  Image
                                </>
                              )}
                              {r.lastMessage.type === "voice" && (
                                <>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                    />
                                  </svg>
                                  Voice message
                                </>
                              )}
                              {r.lastMessage.type === "video" && (
                                <>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                  </svg>
                                  Video
                                </>
                              )}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-400 italic">No messages yet</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
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