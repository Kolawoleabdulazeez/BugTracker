/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CHAT_MESSAGES_QUERY_KEY,
  GROUP_CHATS_QUERY_KEY,
  USER_MESSAGES_QUERY_KEY,
  USER_PERSONAL_MESSAGES_QUERY_KEY,
} from "../chat/useChat";
import {
  DM_HUB,
  ensureConnected,
  ensureDmConnected,
  getChatConnection,
  getDmConnection,
  joinConversation,
  joinRoom,
  leaveConversation,
  leaveRoom,
} from "./signal";
import { getAuthFromStorage } from "@/utils/lib";

const messagesKey = (id: string) => [...USER_PERSONAL_MESSAGES_QUERY_KEY, id];

/* ───────────────────────── Group chat ───────────────────────── */

export function useChatSocket(projectId?: string) {
  const queryClient = useQueryClient();
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const auth = getAuthFromStorage();
  const currentUserId = auth?.user?.id ?? "";
  const currentUserName = auth?.user?.fullName ?? "";

  useEffect(() => {
    if (!projectId) return;
    const connection = getChatConnection();
    let isMounted = true;

    const handleNewMessage = (payload: any) => {
      const incomingProjectId = String(payload.projectId);
      const incomingMessage = payload.message;
      if (!incomingMessage) return;

      // The server sends the same payload to everyone, so compute isMine here
      const senderId =
        incomingMessage.sender?.userId ?? incomingMessage.sender?.id ?? "";

      const messageWithIsMine = {
        ...incomingMessage,
        isMine: currentUserId !== "" && String(senderId) === String(currentUserId),
      };

      queryClient.setQueryData(
        [...CHAT_MESSAGES_QUERY_KEY, incomingProjectId],
        (oldData: any[] = []) =>
          oldData.some((m) => String(m.id) === String(messageWithIsMine.id))
            ? oldData
            : [...oldData, messageWithIsMine]
      );

      queryClient.setQueryData(GROUP_CHATS_QUERY_KEY, (oldRooms: any[] = []) =>
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

    const handleUserTyping = (data: any) => {
      const name =
        data?.fullName ?? data?.name ?? data?.userName ?? data?.senderName ?? null;
      if (!name || name === currentUserName) return;

      setTypingUsers((prev) => (prev.includes(name) ? prev : [...prev, name]));
      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((n) => n !== name));
      }, 2500);
    };

    connection.on("ReceiveMessage", handleNewMessage);
    connection.on("UserTyping", handleUserTyping);

    joinRoom(projectId).catch((e) => {
      if (isMounted) console.error("SignalR connection/join failed:", e);
    });

    return () => {
      isMounted = false;
      connection.off("ReceiveMessage", handleNewMessage);
      connection.off("UserTyping", handleUserTyping);
      leaveRoom(projectId);
    };
  }, [projectId, queryClient, currentUserId, currentUserName]);

  const sendMessage = async (content: string, replyToId: string | null = null) => {
    if (!projectId || !content.trim()) return;
    try {
      setIsSending(true);
      const c = await ensureConnected();
      await c.invoke("SendMessage", projectId, content.trim(), replyToId);
    } catch (error) {
      console.error("SendMessage failed:", error);
      toast.error("Could not send message");
    } finally {
      setIsSending(false);
    }
  };

  const lastTypingSent = useRef(0);
  const handleTypingKeystroke = async () => {
    if (!projectId || !currentUserName) return;
    const now = Date.now();
    if (now - lastTypingSent.current < 1500) return;
    lastTypingSent.current = now;
    try {
      const c = await ensureConnected();
      await c.invoke("UserTyping", projectId, currentUserName);
    } catch (error) {
      console.error("UserTyping failed:", error);
    }
  };

  return { sendMessage, isSending, typingUsers, handleTypingKeystroke };
}

/* ───────────────────────── Direct messages ───────────────────────── */

export function useDmSocket(activeConversationId?: string | null) {
  const queryClient = useQueryClient();
  const [isSending, setIsSending] = useState(false);
  const [typingNames, setTypingNames] = useState<string[]>([]);
  const lastTypingSent = useRef(0);

  const auth = getAuthFromStorage();
  const currentUserId = auth?.user?.id ?? "";
  const currentUserName = auth?.user?.fullName ?? "";

  // Join the open conversation, leave it when it changes or closes
  useEffect(() => {
    if (!activeConversationId) return;

    joinConversation(activeConversationId).catch((e) =>
      console.error("JoinConversation failed:", e)
    );

    return () => {
      leaveConversation(activeConversationId);
      setTypingNames([]);
    };
  }, [activeConversationId]);

  // Incoming events
  useEffect(() => {
     const connection = getDmConnection(); 

    const onReceive = (payload: any) => {
      const msg = payload?.message ?? payload;
      if (!msg?.id) return;
      const conversationId = String(msg.conversationId ?? payload?.conversationId ?? "");

      if (conversationId) {
        const withMine = {
          ...msg,
          isMine: String(msg.sender?.userId ?? "") === String(currentUserId),
        };
        queryClient.setQueryData(messagesKey(conversationId), (old: any) => {
          if (!old) return old; // not opened yet, it loads fresh when opened
          const exists = old.messages?.some(
            (m: any) => String(m.id) === String(withMine.id)
          );
          return exists
            ? old
            : { ...old, messages: [...(old.messages ?? []), withMine] };
        });
      }
      queryClient.invalidateQueries({ queryKey: USER_MESSAGES_QUERY_KEY });
    };

    const onEdited = (payload: any) => {
      const msg = payload?.message ?? payload;
      const conversationId = String(msg?.conversationId ?? payload?.conversationId ?? "");
      if (!conversationId) return;
      const messageId = String(msg?.id ?? payload?.messageId ?? "");
      const content = msg?.content ?? payload?.newContent;
      queryClient.setQueryData(messagesKey(conversationId), (old: any) =>
        old
          ? {
              ...old,
              messages: old.messages.map((m: any) =>
                String(m.id) === messageId ? { ...m, content, isEdited: true } : m
              ),
            }
          : old
      );
      queryClient.invalidateQueries({ queryKey: USER_MESSAGES_QUERY_KEY });
    };

    const onDeleted = (payload: any) => {
      const conversationId = String(
        payload?.conversationId ?? payload?.message?.conversationId ?? ""
      );
      const messageId = String(
        payload?.messageId ?? payload?.message?.id ?? payload?.id ?? ""
      );
      if (!conversationId || !messageId) return;
      queryClient.setQueryData(messagesKey(conversationId), (old: any) =>
        old
          ? {
              ...old,
              messages: old.messages.map((m: any) =>
                String(m.id) === messageId ? { ...m, isDeleted: true } : m
              ),
            }
          : old
      );
      queryClient.invalidateQueries({ queryKey: USER_MESSAGES_QUERY_KEY });
    };

    const onTyping = (a: any, b?: any) => {
      // payload shape unknown: (userName), (conversationId, userName) or an object
      const name =
        typeof a === "string" && typeof b === "string"
          ? b
          : typeof a === "string"
          ? a
          : a?.userName ?? a?.fullName ?? a?.name;
      if (!name || name === currentUserName) return;
      setTypingNames((prev) => (prev.includes(name) ? prev : [...prev, name]));
      setTimeout(
        () => setTypingNames((prev) => prev.filter((n) => n !== name)),
        2500
      );
    };

    DM_HUB.receive.forEach((n) => connection.on(n, onReceive));
    DM_HUB.edited.forEach((n) => connection.on(n, onEdited));
    DM_HUB.deleted.forEach((n) => connection.on(n, onDeleted));
    DM_HUB.typingEvent.forEach((n) => connection.on(n, onTyping));
    ensureDmConnected().catch((e) => console.error("DM SignalR start failed:", e));

    return () => {
      DM_HUB.receive.forEach((n) => connection.off(n, onReceive));
      DM_HUB.edited.forEach((n) => connection.off(n, onEdited));
      DM_HUB.deleted.forEach((n) => connection.off(n, onDeleted));
      DM_HUB.typingEvent.forEach((n) => connection.off(n, onTyping));
    };
  }, [queryClient, currentUserId, currentUserName]);

  const sendDm = useCallback(
    async (otherUserId: string, content: string, replyToId: string | null = null) => {
      if (!content.trim()) return false;
      try {
        setIsSending(true);
        // A draft chat has no conversation yet, so there is nothing to join
        if (activeConversationId) await joinConversation(activeConversationId);
        const c = await ensureDmConnected(); 
        await c.invoke(DM_HUB.send, otherUserId, content.trim(), replyToId);
        queryClient.invalidateQueries({ queryKey: USER_MESSAGES_QUERY_KEY });
        if (activeConversationId) {
          queryClient.invalidateQueries({ queryKey: messagesKey(activeConversationId) });
        }
        return true;
      } catch (e) {
        console.error("SendDm failed:", e);
        toast.error("Could not send message");
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [queryClient, activeConversationId]
  );

  const emitTyping = useCallback(async () => {
    if (!activeConversationId || !currentUserName) return;
    const now = Date.now();
    if (now - lastTypingSent.current < 1500) return;
    lastTypingSent.current = now;
    try {
      await joinConversation(activeConversationId);
      const c = await ensureDmConnected(); 
      await c.invoke(DM_HUB.typing, activeConversationId, currentUserName);
    } catch (e) {
      console.error("Typing failed:", e);
    }
  }, [activeConversationId, currentUserName]);

  const editDm = async (conversationId: string, messageId: string, newContent: string) => {
    try {
      await joinConversation(conversationId);
      const c = await ensureDmConnected(); 
      await c.invoke(DM_HUB.edit, conversationId, messageId, newContent.trim());
      queryClient.invalidateQueries({ queryKey: messagesKey(conversationId) });
      return true;
    } catch (e) {
      console.error("EditMessage failed:", e);
      toast.error("Could not edit message");
      return false;
    }
  };

  const deleteDm = async (conversationId: string, messageId: string) => {
    try {
      await joinConversation(conversationId);
      const c = await ensureDmConnected(); 
      await c.invoke(DM_HUB.remove, conversationId, messageId);
      queryClient.invalidateQueries({ queryKey: messagesKey(conversationId) });
      return true;
    } catch (e) {
      console.error("DeleteMessage failed:", e);
      toast.error("Could not delete message");
      return false;
    }
  };

  return {
    sendDm,
    isSendingDm: isSending,
    dmTypingUsers: typingNames,
    emitTyping,
    editDm,
    deleteDm,
  };
}