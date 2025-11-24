"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import AdminChatList from "@/components/AdminChat/AdminChatList";
import AdminChatWindow from "@/components/AdminChat/AdminChatWindow";
import { useSocket } from "@/components/Chat/useSocket";

export default function AdminChatPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const socket = useSocket(!!user && isAdmin);

  // Fetch all admin rooms
  useEffect(() => {
    if (!isAdmin) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/admin/rooms`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.success) setRooms(data.data || []);
      })
      .catch(console.error);
  }, [isAdmin]);

  // Update rooms in real-time if new messages come in
useEffect(() => {
  if (!socket?.current) return;

  const handleNewMessage = (msg: any) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === msg.roomId
          ? { ...r, lastMessage: msg }
          : r
      )
    );
  };

  socket.current.on("receive_message", handleNewMessage);

  // Cleanup safely
  return () => {
    if (socket.current) {
      socket.current.off("receive_message", handleNewMessage);
    }
  };
}, [socket]);


  if (isLoading)
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAdmin)
    return <div className="min-h-screen flex items-center justify-center">Access denied</div>;

  return (
    <div className="flex gap-6">
      <AdminChatList rooms={rooms} onSelect={(id) => setSelectedRoom(id)} />
      <div className="flex-1 bg-white rounded shadow-md flex flex-col">
        <AdminChatWindow socket={socket} roomId={selectedRoom} currentAdminId={user?.id ?? ""} />
      </div>
    </div>
  );
}
