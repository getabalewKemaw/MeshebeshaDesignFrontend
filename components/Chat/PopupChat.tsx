"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useSocket } from "./useSocket";
import axios from "axios";
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

export default function PopupChat({ productId }: { productId?: string }) {
    const { user } = useAuth();
    const socketRef = useSocket(!!user);
    const [isOpen, setIsOpen] = useState(false);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [isAdminOnline, setIsAdminOnline] = useState(false);
    const [text, setText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();
    const fileRef = useRef<HTMLInputElement | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // Don't show chat for admin users
    if (user?.role === "admin") return null;

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Create/get room when user is available
    useEffect(() => {
        if (!user) return;
        (async () => {
            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/rooms`,
                    { productId: productId || undefined },
                    { withCredentials: true }
                );
                setRoomId(res.data?.data?.id);
            } catch (err) {
                console.error("[PopupChat] create room error", err);
            }
        })();
    }, [user, productId]);

    // Socket events
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket || !roomId) return;

        socket.emit("join_room", { roomId });

        const handleReceive = (msg: Message) => {
            setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
        };

        const handleMessageSent = (payload: any) => {
            const { message, tempId } = payload;
            setMessages((prev) => {
                if (tempId) {
                    const replaced = prev.map((m) => (m.id === tempId ? message : m));
                    if (!replaced.some((m) => m.id === message.id)) replaced.push(message);
                    return replaced;
                }
                if (prev.some((m) => m.id === message.id)) return prev;
                return [...prev, message];
            });
        };

        const handleTyping = (data: { userId: string; isTyping: boolean }) => {
            setTypingUsers((prev) => {
                if (data.isTyping) return Array.from(new Set([...prev, data.userId]));
                return prev.filter((id) => id !== data.userId);
            });
        };

        const handleUserOnline = (data: { userId: string; role: string }) => {
            if (data.role === "admin") setIsAdminOnline(true);
        };

        const handleUserOffline = (data: { userId: string }) => {
            setIsAdminOnline(false);
        };

        socket.on("receive_message", handleReceive);
        socket.on("message_sent", handleMessageSent);
        socket.on("typing", handleTyping);
        socket.on("user_online", handleUserOnline);
        socket.on("user_offline", handleUserOffline);

        // Load message history
        (async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/rooms/${roomId}/messages`,
                    { withCredentials: true }
                );
                setMessages(res.data?.data || []);
            } catch (err) {
                console.error("[PopupChat] load messages error", err);
            }
        })();

        return () => {
            socket.off("receive_message", handleReceive);
            socket.off("message_sent", handleMessageSent);
            socket.off("typing", handleTyping);
            socket.off("user_online", handleUserOnline);
            socket.off("user_offline", handleUserOffline);
            socket.emit("leave_room", { roomId });
        };
    }, [socketRef, roomId]);

    // Handle typing indicator
    const handleTypingIndicator = () => {
        if (!socketRef.current || !roomId) return;

        if (!isTyping) {
            setIsTyping(true);
            socketRef.current.emit("typing", { roomId, isTyping: true });
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            socketRef.current?.emit("typing", { roomId, isTyping: false });
        }, 1000);
    };

    const sendMessage = () => {
        if (!text.trim() || !socketRef.current || !roomId) return;

        const tempId = `temp-${Date.now()}`;
        socketRef.current.emit("send_message", {
            roomId,
            type: "text",
            content: text,
            tempId,
        });

        setText("");
        setIsTyping(false);
        socketRef.current.emit("typing", { roomId, isTyping: false });
    };

    // File upload
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

                socketRef.current?.emit("send_message", { roomId, type, content: url });
                setPreviewUrl(null);
                setSelectedFile(null);
            } else {
                setUploadError("Upload failed");
            }
        } catch (err: any) {
            console.error("[PopupChat] Upload error:", err);
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

                // Upload voice recording
                const file = new File([audioBlob], "voice-message.webm", { type: "audio/webm" });
                await uploadAndSend(file);

                // Stop all tracks
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

    if (!user) return null;

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-[#1E2A55] text-white hover:bg-[#2A3A65] transition-colors z-50 flex items-center justify-center shadow-lg"
                aria-label="Open chat"
            >
                {isOpen ? (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <>
                        <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {isAdminOnline && (
                            <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white"></span>
                        )}
                    </>
                )}
            </button>

            {/* Chat Popup Window */}
            {isOpen && (
                <div className="fixed bottom-16 right-0 left-0 sm:bottom-24 sm:right-6 sm:left-auto w-full sm:w-96 h-[calc(100vh-4rem)] sm:h-[600px] sm:max-h-[80vh] bg-white border-2 border-[#1E2A55] shadow-2xl z-50 flex flex-col">
                    {/* Header */}
                    <div className="bg-[#1E2A55] text-white p-3 sm:p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="relative">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white text-[#1E2A55] flex items-center justify-center font-bold text-sm sm:text-base">
                                    S
                                </div>
                                {isAdminOnline && (
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-[#1E2A55]"></span>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm sm:text-base">Support Chat</h3>
                                <p className="text-xs text-gray-300 hidden sm:block">
                                    {isAdminOnline ? "Admin is online" : "We'll respond soon"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gray-300 transition-colors"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-white space-y-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-500 mt-8">
                                <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <p className="text-xs sm:text-sm">Start a conversation</p>
                            </div>
                        )}

                        {messages.map((msg) => {
                            const isMine = msg.senderId === user.id;
                            return (
                                <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`max-w-[85%] sm:max-w-[75%] px-3 sm:px-4 py-2 border ${isMine
                                                ? "bg-[#1E2A55] text-white border-[#1E2A55]"
                                                : "bg-white text-gray-800 border-gray-300"
                                            }`}
                                    >
                                        {msg.type === "text" && <p className="text-sm break-words">{msg.content}</p>}
                                        {msg.type === "image" && (
                                            <Image
                                                width={200}
                                                height={200}
                                                src={msg.content}
                                                alt="Image"
                                                className="max-h-48 object-cover"
                                            />
                                        )}
                                        {msg.type === "video" && (
                                            <video controls className="max-h-48 w-full">
                                                <source src={msg.content} />
                                            </video>
                                        )}
                                        {msg.type === "voice" && (
                                            <audio controls className="w-full">
                                                <source src={msg.content} />
                                            </audio>
                                        )}
                                        <span className={`text-xs mt-1 block ${isMine ? "text-gray-300" : "text-gray-500"}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Typing Indicator */}
                        {typingUsers.length > 0 && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 border border-gray-300 px-4 py-2">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-600 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                        <span className="w-2 h-2 bg-gray-600 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                        <span className="w-2 h-2 bg-gray-600 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Preview */}
                    {previewUrl && (
                        <div className="p-2 sm:p-3 border-t border-gray-300 bg-gray-50">
                            <div className="flex items-start gap-2">
                                {selectedFile?.type.startsWith("image/") && (
                                    <img src={previewUrl} className="max-h-16 sm:max-h-20 border border-gray-300" alt="preview" />
                                )}
                                {selectedFile?.type.startsWith("video/") && (
                                    <video src={previewUrl} className="max-h-16 sm:max-h-20 border border-gray-300" controls />
                                )}
                                {selectedFile?.type.startsWith("audio/") && <audio src={previewUrl} controls className="w-full" />}
                                <div className="flex flex-col gap-1">
                                    <button
                                        className="text-xs sm:text-sm px-2 py-1 bg-[#1E2A55] text-white hover:bg-[#2A3A65]"
                                        onClick={() => uploadAndSend()}
                                        disabled={loading}
                                    >
                                        {loading ? "Uploading..." : "Send"}
                                    </button>
                                    <button
                                        className="text-xs sm:text-sm px-2 py-1 border border-[#1E2A55] hover:bg-gray-100"
                                        onClick={() => {
                                            setPreviewUrl(null);
                                            setSelectedFile(null);
                                            setUploadError(null);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                            {uploadError && <p className="text-xs text-red-600 mt-1">{uploadError}</p>}
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-2 sm:p-3 bg-white border-t-2 border-[#1E2A55]">
                        <div className="flex items-center gap-1 sm:gap-2">
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => {
                                    setText(e.target.value);
                                    handleTypingIndicator();
                                }}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Type your message..."
                                className="flex-1 px-2 sm:px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#1E2A55] text-sm"
                            />

                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*,video/*,audio/*"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) onFileSelected(e.target.files[0]);
                                }}
                            />

                            <button
                                onClick={() => fileRef.current?.click()}
                                disabled={loading}
                                className="p-1.5 sm:p-2 border border-[#1E2A55] hover:bg-gray-100 disabled:opacity-50"
                                title="Attach file"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                            </button>

                            <button
                                onClick={isRecording ? stopRecording : startRecording}
                                className={`p-1.5 sm:p-2 border ${isRecording ? "bg-red-600 text-white border-red-600" : "border-[#1E2A55] hover:bg-gray-100"}`}
                                title={isRecording ? "Stop recording" : "Record voice"}
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            </button>

                            <button
                                onClick={sendMessage}
                                disabled={!text.trim() || loading}
                                className="px-2 sm:px-4 py-2 bg-[#1E2A55] text-white hover:bg-[#2A3A65] disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #888;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
        </>
    );
}
