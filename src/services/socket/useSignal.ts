import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CHAT_MESSAGES_QUERY_KEY, GROUP_CHATS_QUERY_KEY } from "../chat/useChat";
import { getChatConnection } from "./signal";
import { getAuthFromStorage } from "@/utils/lib";

export function useChatSocket(projectId?: string) {
  const queryClient = useQueryClient();
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get current user once — used to compute isMine on incoming socket messages
  const auth = getAuthFromStorage();
  const currentUserId = auth?.user?.id ?? "";
  const currentUserName = auth?.user?.fullName ?? "";

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

    // ── ReceiveMessage ─────────────────────────────────────────────────────
    const handleNewMessage = (payload: any) => {
      console.log("🔥 Incoming message:", payload);

      const incomingProjectId = String(payload.projectId);
      const incomingMessage = payload.message;

      if (!incomingMessage) return;

      // ✅ Fix: compute isMine by comparing sender.userId to the logged-in user
      // The server sends the same payload to everyone — it never sets isMine per-recipient
      const senderId =
        incomingMessage.sender?.userId ??
        incomingMessage.sender?.id ??
        "";

      const messageWithIsMine = {
        ...incomingMessage,
        isMine: currentUserId !== "" && String(senderId) === String(currentUserId),
      };

      queryClient.setQueryData(
        [...CHAT_MESSAGES_QUERY_KEY, incomingProjectId],
        (oldData: any[] = []) => {
          const alreadyExists = oldData.some(
            (item) => String(item.id) === String(messageWithIsMine.id)
          );
          return alreadyExists ? oldData : [...oldData, messageWithIsMine];
        }
      );

      queryClient.setQueryData(
        GROUP_CHATS_QUERY_KEY,
        (oldRooms: any[] = []) =>
          oldRooms.map((room) =>
            String(room.projectId) === incomingProjectId
              ? {
                  ...room,
                  lastMessage: messageWithIsMine,
                  lastActivityAt: messageWithIsMine.sentAt,
                }
              : room
          )
      );
    };

    // ── UserTyping ──────────────────────────────────────────────────────────
    const handleUserTyping = (data: any) => {
      console.log("⌨️ UserTyping payload:", data);

      const name =
        data?.fullName ??
        data?.name ??
        data?.userName ??
        data?.senderName ??
        null;

      if (!name || name === currentUserName) return;

      setTypingUsers((prev) =>
        prev.includes(name) ? prev : [...prev, name]
      );

      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((n) => n !== name));
      }, 2500);
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
  }, [projectId, queryClient, currentUserId, currentUserName]);

  // ── sendMessage ────────────────────────────────────────────────────────────
  const sendMessage = async (
    content: string,
    replyToId: string | null = null
  ) => {
    if (!projectId || !content.trim()) return;

    const connection = getChatConnection();
    try {
      setIsSending(true);
      await connection.invoke(
        "SendMessage",
        projectId,
        content.trim(),
        replyToId
      );
    } catch (error) {
      console.error("SendMessage failed:", error);
    } finally {
      setIsSending(false);
    }
  };

  // ── typing ─────────────────────────────────────────────────────────────────
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
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    // Debounce — no "false" call because backend doesn't accept isTyping flag
    typingTimeoutRef.current = setTimeout(() => {}, 2000);
  };

  return { sendMessage, isSending, typingUsers, handleTypingKeystroke };
}