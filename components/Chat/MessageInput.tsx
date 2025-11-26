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
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        audioChunksRef.current = [];

        const file = new File([audioBlob], "voice-message.webm", { type: "audio/webm" });
        await uploadAndSend(file);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording", err);
      setUploadError("Microphone access denied");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleTyping = () => {
    socket?.current?.emit("typing", { roomId, isTyping: text.length > 0 });
  };

  return (
    <div className="flex flex-col gap-3">
      {previewUrl && (
        <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-300">
          {selectedFile?.type.startsWith("image/") && <img src={previewUrl} className="max-h-24 border border-gray-300" alt="preview" />}
          {selectedFile?.type.startsWith("video/") && (
            <video src={previewUrl} className="max-h-24 border border-gray-300" controls />
          )}
          {!selectedFile?.type.startsWith("image/") && !selectedFile?.type.startsWith("video/") && (
            <audio src={previewUrl} controls className="w-full" />
          )}
          <div className="flex flex-col gap-2">
            <button
              className="px-3 py-1 bg-[#1E2A55] text-white hover:bg-[#2A3A65] text-sm"
              onClick={() => uploadAndSend()}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Send"}
            </button>
            <button
              className="px-3 py-1 border border-[#1E2A55] hover:bg-gray-100 text-sm"
              onClick={() => { setPreviewUrl(null); setSelectedFile(null); setUploadError(null); }}
            >
              Cancel
            </button>
            {uploadError && (
              <div className="text-xs text-red-500">
                {uploadError}
                <button onClick={() => uploadAndSend()} className="ml-2 underline">Retry</button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:border-[#1E2A55]"
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

        <button
          className="px-4 py-2 border border-[#1E2A55] hover:bg-gray-100"
          onClick={() => fileRef.current?.click()}
          disabled={loading}
          title="Attach file"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-4 py-2 border ${isRecording ? "bg-red-600 text-white border-red-600" : "border-[#1E2A55] hover:bg-gray-100"}`}
          title={isRecording ? "Stop recording" : "Record voice"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>

        <button
          className="px-6 py-2 bg-[#1E2A55] text-white hover:bg-[#2A3A65] disabled:opacity-50"
          onClick={sendText}
          disabled={!text.trim() || loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}