import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CHAT_MESSAGES_QUERY_KEY, GROUP_CHATS_QUERY_KEY } from "../chat/useChat";
import { getChatConnection } from "./socket";
import { getAuthFromStorage } from "@/utils/lib";

export function useChatSocket(projectId?: string) {
  const queryClient = useQueryClient();
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentUserName = getAuthFromStorage()?.user?.fullName ?? "";

  useEffect(() => {
    const connection = getChatConnection();
    if (!projectId) return;

    let isMounted = true;

    const startAndJoin = async () => {
      try {
        if (connection.state === "Disconnected") {
          await connection.start();
          console.log("✅ SignalR connected");
        }

        if (!isMounted) return;

        await connection.invoke("JoinRoom", projectId);
        console.log("Joined room:", projectId);
      } catch (error) {
        console.error("SignalR connection/join failed:", error);
      }
    };

  const handleNewMessage = (payload: any) => {
  console.log("🔥 Incoming message:", payload);

  const incomingProjectId = String(payload.projectId);
  const incomingMessage = payload.message;

  if (!incomingMessage) return;

  queryClient.setQueryData(
    [...CHAT_MESSAGES_QUERY_KEY, incomingProjectId],
    (oldData: any[] = []) => {
      const alreadyExists = oldData.some(
        (item) => String(item.id) === String(incomingMessage.id)
      );

      return alreadyExists ? oldData : [...oldData, incomingMessage];
    }
  );

  queryClient.setQueryData(
    GROUP_CHATS_QUERY_KEY,
    (oldRooms: any[] = []) =>
      oldRooms.map((room) =>
        String(room.projectId) === incomingProjectId
          ? {
              ...room,
              lastMessage: incomingMessage,
              lastActivityAt: incomingMessage.sentAt,
            }
          : room
      )
  );
};
    const handleUserTyping = (data: {
      userId: string;
      fullName: string;
      isTyping?: boolean;
    }) => {
      const name = data.fullName;

      setTypingUsers((prev) =>
        prev.includes(name) ? prev : [...prev, name]
      );

      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((n) => n !== name));
      }, 2000);
    };

    connection.on("ReceiveMessage", handleNewMessage);
    connection.on("UserTyping", handleUserTyping);

    startAndJoin();

    return () => {
      isMounted = false;
      connection.off("ReceiveMessage", handleNewMessage);
      connection.off("UserTyping", handleUserTyping);

      if (projectId) {
        connection.invoke("LeaveRoom", projectId).catch(console.error);
      }
    };
  }, [projectId, queryClient]);

  const sendMessage = async (content: string, replyToId: string | null = null) => {
    if (!projectId || !content.trim()) return;

    const connection = getChatConnection();

    try {
      setIsSending(true);
      await connection.invoke("SendMessage", projectId, content.trim(), replyToId);
    } catch (error) {
      console.error("SendMessage failed:", error);
    } finally {
      setIsSending(false);
    }
  };

  const emitTyping = async () => {
    if (!projectId || !currentUserName) return;

    try {
      const connection = getChatConnection();
      await connection.invoke("UserTyping", projectId, currentUserName);
    } catch (error) {
      console.error("UserTyping failed:", error);
    }
  };

  const handleTypingKeystroke = () => {
    emitTyping();

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      // no "false" call because backend signature does not accept isTyping
    }, 2000);
  };

  return { sendMessage, isSending, typingUsers, handleTypingKeystroke };
}