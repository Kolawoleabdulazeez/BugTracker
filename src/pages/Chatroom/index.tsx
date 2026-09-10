import PageLayout from "@/Component/Layout/PageLayout";

import { useChatSocket } from "@/services/socket/useSignal";
import { ChatSidebar } from "./ChatSidebar";
import { ChatWindow } from "./ChatWindow";
import { GroupChatResponse, GroupMessages, Message, UserChats } from "@/services/chat/chat.api";
import { EmptyState } from "./Shared";
import { useRef, useState } from "react";
import { useGetChatMessages, useGetDMMessages, useGetGroupChats, useGetUserChats } from "@/services/chat/useChat";
import { DMWindow } from "./DMWindow";

const Chats = () => {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeDmId, setActiveDmId] = useState<string | null>(null);

  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: groupChats = [], isLoading: chatLoading } = useGetGroupChats();
  const { data: chatMessages = [], isLoading: messagesLoading } = useGetChatMessages(activeProjectId ?? undefined);
  const { sendMessage, isSending, typingUsers, handleTypingKeystroke } = useChatSocket(activeProjectId ?? undefined);
  const { data: userChats = [], isLoading: userChatLoading } = useGetUserChats();
  const activeDm = (userChats as UserChats[]).find((c) => c.id === activeDmId);
  const { data: dmsData, isLoading: dmsLoading } = useGetDMMessages(activeDmId ?? undefined);
  const dmsMessages = dmsData?.messages ?? [];

  const activeChat = (groupChats as GroupChatResponse[]).find((c) => c.projectId === activeProjectId);

  const handleSelectDm = (id: string) => {
    setActiveDmId(id);
    setActiveProjectId(null);
    setShowMobileSidebar(false);
    setInput("");
  };

  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
    setActiveDmId(null);
    setShowMobileSidebar(false);
    setInput("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
    handleTypingKeystroke();
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    if (activeProjectId) {
      sendMessage(trimmed);
    } else if (activeDmId) {
      console.log("DM send:", trimmed);
    }

    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <PageLayout title="Chatroom" showSearch={false} contentClassName="!p-0">
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        <ChatSidebar
          chats={groupChats as GroupChatResponse[]}
          userChats={userChats as UserChats[]}
          isLoading={chatLoading}
          userChatLoading={userChatLoading}
          activeProjectId={activeProjectId}
          activeDmId={activeDmId}
          search={search}
          onSearchChange={setSearch}
          onSelectProject={handleSelectProject}
          onSelectDm={handleSelectDm}
          show={showMobileSidebar}
        />

        {activeChat ? (
          <ChatWindow
            activeChat={activeChat}
            messages={chatMessages as GroupMessages[]}
            isLoading={messagesLoading}
            input={input}
            isSending={isSending}
            typingUsers={typingUsers}
            show={!showMobileSidebar}
            onBack={() => setShowMobileSidebar(true)}
            onInputChange={handleInputChange}
            onSend={handleSend}
            onKeyDown={handleKeyDown}
          />
        ) : activeDm ? (
          <DMWindow
            activeDm={activeDm}
            messages={dmsMessages}
            isLoading={dmsLoading}
            input={input}
            isSending={isSending}
            typingUsers={typingUsers}
            show={!showMobileSidebar}
            onBack={() => setShowMobileSidebar(true)}
            onInputChange={handleInputChange}
            onSend={handleSend}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </PageLayout>
  );
};
export default Chats;