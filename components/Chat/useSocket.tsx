"use client";
import { io, Socket } from "socket.io-client";
import { useEffect, useRef } from "react";

export function useSocket(connectWhen = false) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!connectWhen) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000", {
      transports: ["websocket"],
      withCredentials: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => console.log("[Socket] Connected", socket.id));
    socket.on("connect_error", (err) => console.error("[Socket] Connect error", err));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [connectWhen]);

  return socketRef;
}
