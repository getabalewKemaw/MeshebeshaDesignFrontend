"use client";
import React, { useRef, useState } from 'react';
import axios from 'axios';

export default function MessageInput({ socket, roomId, onSend }: { socket: any; roomId: string; onSend: (msg: any) => void }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const sendText = async () => {
    if (!text.trim()) return;
    const tempId = 'temp-' + Date.now();
    const payload = { roomId, type: 'text', content: text, tempId };
    // Emit via socket (include tempId for server ack)
    console.log('[MessageInput] emit send_message', payload);
    socket?.current?.emit('send_message', payload);
    setText('');
    onSend({ ...payload, id: tempId, createdAt: new Date().toISOString(), senderId: 'me' });
  };

  const uploadAndSend = async (file: File) => {
    setLoading(true);
    try {
      const form = new FormData();
      form.append('media', file);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/chat/upload`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      const url = res.data?.data?.url;
      if (url) {
        const tempId = 'temp-' + Date.now();
        const type = file.type.startsWith('image/') ? 'image' : 'voice';
        console.log('[MessageInput] emit send_message', { roomId, type, content: url, tempId });
        socket?.current?.emit('send_message', { roomId, type, content: url, tempId });
        onSend({ id: tempId, roomId, senderId: 'me', type, content: url, createdAt: new Date().toISOString() });
      }
    } catch (err) {
      console.error('Upload error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 border-t flex items-center gap-2">
      <input
        className="flex-1 p-2 border rounded"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') sendText(); }}
        placeholder="Type a message"
      />
      <input ref={fileRef} type="file" accept="image/*,audio/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) uploadAndSend(e.target.files[0]); }} />
      <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => fileRef.current?.click()} disabled={loading}>Attach</button>
      <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={sendText} disabled={loading}>Send</button>
    </div>
  );
}
