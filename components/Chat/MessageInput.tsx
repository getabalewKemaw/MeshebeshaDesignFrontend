"use client";
import React, { useRef, useState } from "react";
import axios from "axios";

type Props = {
  socket: any;
  roomId: string;
};

export default function MessageInput({ socket, roomId }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const sendText = () => {
    if (!text.trim()) return;
    socket?.current?.emit("send_message", { roomId, type: "text", content: text });
    setText("");
  };

  const onFileSelected = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadError(null);
  };

  const uploadAndSend = async (file?: File) => {
    const f = file ?? selectedFile;
    if (!f) return;
    setLoading(true);
    setUploadError(null);

    try {
      const form = new FormData();
      form.append("media", f);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/upload`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const url = res.data?.data?.url;
      if (url) {
        // decide type
        let type: "image" | "video" | "voice" = "image";
        if (f.type.startsWith("image/")) type = "image";
        else if (f.type.startsWith("video/")) type = "video";
        else type = "voice";

        socket?.current?.emit("send_message", { roomId, type, content: url });
        setPreviewUrl(null);
        setSelectedFile(null);
      } else {
        setUploadError("Upload failed - no url returned");
      }
    } catch (err: any) {
      console.error("[MessageInput] Upload error:", err);
      setUploadError(err?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleTyping = () => {
    socket?.current?.emit("typing", { roomId, isTyping: text.length > 0 });
  };

  return (
    <div className="p-2 border-t flex flex-col gap-2">
      {previewUrl && (
        <div className="flex items-start gap-2">
          {selectedFile?.type.startsWith("image/") && <img src={previewUrl} className="max-h-28 rounded" alt="preview" />}
          {selectedFile?.type.startsWith("video/") && (
            <video src={previewUrl} className="max-h-28 rounded" controls />
          )}
          {!selectedFile?.type.startsWith("image/") && !selectedFile?.type.startsWith("video/") && (
            <audio src={previewUrl} controls />
          )}
          <div className="flex flex-col">
            <button className="text-sm text-blue-600" onClick={() => uploadAndSend() } disabled={loading}>Upload</button>
            <button className="text-sm text-red-600" onClick={() => { setPreviewUrl(null); setSelectedFile(null); setUploadError(null); }}>Cancel</button>
            {uploadError && <div className="text-xs text-red-500">{uploadError} <button onClick={() => uploadAndSend()} className="ml-2 text-sm underline">Retry</button></div>}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          className="flex-1 p-2 border rounded"
          value={text}
          onChange={(e) => { setText(e.target.value); handleTyping(); }}
          onKeyDown={(e) => e.key === "Enter" && sendText()}
          placeholder="Type a message..."
        />

        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*,audio/*"
          className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) onFileSelected(e.target.files[0]); }}
        />
        <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => fileRef.current?.click()} disabled={loading}>Attach</button>
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={sendText} disabled={!text.trim() || loading}>Send</button>
      </div>
    </div>
  );
}
