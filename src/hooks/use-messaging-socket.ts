"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import { Message } from "@/types";
import { useSWRConfig } from "swr";

export function useMessagingSocket(conversationId: string | null) {
  const { user } = useAuth();
  const { mutate } = useSWRConfig();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user || !conversationId) return;

    const newSocket = io(
      process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL || "http://localhost:3001"
    );
    setSocket(newSocket);

    // Join the specific conversation's "room"
    newSocket.emit("joinRoom", conversationId);

    // Listen for new messages
    newSocket.on("newMessage", (newMessage: Message) => {
      // When a new message arrives, optimistically update the cache
      // and revalidate to keep the data fresh.
      mutate(
        `/messaging/conversations/${conversationId}/messages`,
        (currentMessages: Message[] = []) => [...currentMessages, newMessage],
        false // Do not revalidate immediately, optimistic update is enough
      );
    });

    // Cleanup on component unmount
    return () => {
      newSocket.emit("leaveRoom", conversationId);
      newSocket.disconnect();
    };
  }, [user, conversationId, mutate]);

  const sendMessage = (content: string) => {
    if (socket && user && conversationId) {
      socket.emit("sendMessage", {
        conversationId,
        senderId: user.profile._id,
        content,
      });
    }
  };

  return { sendMessage };
}
