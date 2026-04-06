import { useQuery } from "@tanstack/react-query";
import { getChatMessages, getGroupChats } from "./chat.api";

export const GROUP_CHATS_QUERY_KEY = ["group-chats"];
export const CHAT_MESSAGES_QUERY_KEY = ["chat-messages"];

export function useGetGroupChats() {
  return useQuery({
    queryKey: GROUP_CHATS_QUERY_KEY,
    queryFn: getGroupChats,
  });
}

export function useGetChatMessages(projectId?: string) {
  return useQuery({
    queryKey: [...CHAT_MESSAGES_QUERY_KEY, projectId],
    queryFn: () => getChatMessages(projectId as string),
    enabled: !!projectId,
  });
}