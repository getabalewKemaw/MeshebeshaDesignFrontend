"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useSocket } from "@/components/Chat/useSocket";
import AdminChatList from "@/components/AdminChat/AdminChatList";
import AdminChatWindow from "@/components/AdminChat/AdminChatWindow";
import axios from "axios";

type RoomSummary = {
  id: string;
  product: { id: string; title: string } | null;
  user: { id: string; name: string; email?: string } | null;
  lastMessage?: { id: string; content: string; type: string; createdAt: string } | null;
  createdAt: string;
};

export default function AdminChatPage() {
  const { user } = useAuth();
  const socketRef = useSocket(!!user && user.role === "admin");
  const [rooms, setRooms] = useState<RoomSummary[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedUserInfo, setSelectedUserInfo] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Load all chat rooms
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/admin/rooms`,
          { withCredentials: true }
        );
        setRooms(res.data?.data || []);
      } catch (err) {
        console.error("Failed to load rooms", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // Listen for online/offline events
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleUserOnline = (data: { userId: string }) => {
      setOnlineUsers((prev) => new Set(prev).add(data.userId));
    };

    const handleUserOffline = (data: { userId: string }) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    };

    socket.on("user_online", handleUserOnline);
    socket.on("user_offline", handleUserOffline);

    return () => {
      socket.off("user_online", handleUserOnline);
      socket.off("user_offline", handleUserOffline);
    };
  }, [socketRef]);

  const handleSelectRoom = (roomId: string, userInfo: any) => {
    setSelectedRoomId(roomId);
    setSelectedUserInfo(userInfo);
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <svg
            className="w-24 h-24 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Access Denied</h2>
          <p className="text-gray-500">You need admin privileges to access this page</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <AdminChatList
        rooms={rooms}
        onSelect={handleSelectRoom}
        selectedRoomId={selectedRoomId}
        onlineUsers={onlineUsers}
      />
      <AdminChatWindow
        socket={socketRef}
        roomId={selectedRoomId}
        currentAdminId={user.id}
        userInfo={selectedUserInfo}
      />
    </div>
  );
}
