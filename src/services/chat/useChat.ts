import { useQuery } from "@tanstack/react-query";
import { getChatMessages, getGroupChats, getUserChats, getUserDmMessages } from "./chat.api";

export const GROUP_CHATS_QUERY_KEY = ["group-chats"];
export const CHAT_MESSAGES_QUERY_KEY = ["chat-messages"];
export const USER_MESSAGES_QUERY_KEY = ["user-messages"]
export const USER_PERSONAL_MESSAGES_QUERY_KEY = ["personal-messages"]

export function useGetGroupChats() {
  return useQuery({
    queryKey: GROUP_CHATS_QUERY_KEY,
    queryFn: getGroupChats,
  });
}

export function useGetUserChats() {
  return useQuery({
    queryKey: USER_MESSAGES_QUERY_KEY,
    queryFn: getUserChats,
  });
}

export function useGetDMMessages(conversationId?: string) {
  return useQuery({
    queryKey: [...USER_PERSONAL_MESSAGES_QUERY_KEY, conversationId],
    queryFn: () => getUserDmMessages(conversationId as string),
    enabled: !!conversationId,
  });
}

export function useGetChatMessages(projectId?: string) {
  return useQuery({
    queryKey: [...CHAT_MESSAGES_QUERY_KEY, projectId],
    queryFn: () => getChatMessages(projectId as string),
    enabled: !!projectId,
  });
}