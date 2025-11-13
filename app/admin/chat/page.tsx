"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/NavBar';
import { useAuth } from '@/lib/hooks/useAuth';
import AdminChatList from '@/components/AdminChat/AdminChatList';
import AdminChatWindow from '@/components/AdminChat/AdminChatWindow';
import { useSocket } from '@/components/Chat/useSocket';

export default function AdminChatPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const socket = useSocket(!!user && isAdmin);

  useEffect(() => {
    if (!isAdmin) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/chat/admin/rooms`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (data?.success) setRooms(data.data || []);
      })
      .catch((e) => console.error(e));
  }, [isAdmin]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAdmin) return <div className="min-h-screen flex items-center justify-center">Access denied</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-6">
        <AdminChatList rooms={rooms} onSelect={(id) => setSelectedRoom(id)} />
        <div className="flex-1 bg-white rounded shadow-md flex flex-col">
          <AdminChatWindow socket={socket} roomId={selectedRoom} currentAdminId={user?.id ?? ''} />
        </div>
      </main>
    </div>
  );
}
