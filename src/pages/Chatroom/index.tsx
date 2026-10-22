import PageLayout from "@/Component/Layout/PageLayout";
import { useRouter } from "next/router";
import { useChatSocket, useDmSocket } from "@/services/socket/useSignal";
import {
  GroupChatResponse,
  GroupMessages,
  OtherParticipant,
  UserChats,
} from "@/services/chat/chat.api";
import { EmptyState } from "./Components/Shared";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useGetChatMessages,
  useGetDMMessages,
  useGetGroupChats,
  useGetUserChats,
} from "@/services/chat/useChat";
import ChatSidebar from "./Components/ChatSidebar";
import ChatWindow from "./Components/ChatWindow";
import DMWindow from "./Components/DMWindow";

const Chats = () => {
  const router = useRouter();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeDmId, setActiveDmId] = useState<string | null>(null);
  const [draftPeer, setDraftPeer] = useState<OtherParticipant | null>(null);

  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: groupChats = [], isLoading: chatLoading } = useGetGroupChats();
  const { data: chatMessages = [], isLoading: messagesLoading } = useGetChatMessages(
    activeProjectId ?? undefined
  );
  const { sendMessage, isSending, typingUsers, handleTypingKeystroke } = useChatSocket(
    activeProjectId ?? undefined
  );

  const { data: userChatsData, isLoading: userChatLoading } = useGetUserChats();
  const userChats = useMemo(() => (userChatsData ?? []) as UserChats[], [userChatsData]);

  const { data: dmsData, isLoading: dmsLoading } = useGetDMMessages(activeDmId ?? undefined);
  const dmsMessages = dmsData?.messages ?? [];

  const activeChat = (groupChats as GroupChatResponse[]).find(
    (c) => c.projectId === activeProjectId
  );

  const activeDm: UserChats | undefined =
    userChats.find((c) => c.id === activeDmId) ??
    (draftPeer
      ? {
          id: "",
          otherParticipant: draftPeer,
          sender: draftPeer,
          lastMessageSnippet: "",
          lastMessageAt: "",
          lastMessageIsMine: false,
        }
      : undefined);

  // Must come after activeDm, because the hook joins that conversation
  const { sendDm, isSendingDm, dmTypingUsers, emitTyping } = useDmSocket(
    activeDm?.id || null
  );

  // Arrive from a profile: /Chatroom?dmUserId=...&dmName=...&dmEmail=...
  const { dmUserId, dmName, dmEmail } = router.query;
  useEffect(() => {
    if (!router.isReady || typeof dmUserId !== "string" || userChatLoading) return;
    const existing = userChats.find((c) => c.otherParticipant.userId === dmUserId);
    if (existing) {
      setActiveDmId(existing.id);
      setDraftPeer(null);
    } else {
      setActiveDmId(null);
      setDraftPeer({
        userId: dmUserId,
        fullName: typeof dmName === "string" ? dmName : "New chat",
        email: typeof dmEmail === "string" ? dmEmail : "",
      });
    }
    setActiveProjectId(null);
    setShowMobileSidebar(false);
    router.replace("/Chatroom", undefined, { shallow: true });
  }, [router.isReady, dmUserId, dmName, dmEmail, userChatLoading, userChats, router]);

  // Once the first message creates the conversation, swap the draft for the real one
  useEffect(() => {
    if (!draftPeer) return;
    const created = userChats.find((c) => c.otherParticipant.userId === draftPeer.userId);
    if (created) {
      setActiveDmId(created.id);
      setDraftPeer(null);
    }
  }, [userChats, draftPeer]);

  const handleSelectDm = (id: string) => {
    setActiveDmId(id);
    setDraftPeer(null);
    setActiveProjectId(null);
    setShowMobileSidebar(false);
    setInput("");
  };

  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
    setActiveDmId(null);
    setDraftPeer(null);
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
    if (activeProjectId) handleTypingKeystroke();
    else if (activeDm?.id) emitTyping();
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending || isSendingDm) return;

    if (activeProjectId) {
      sendMessage(trimmed);
    } else if (activeDm) {
      const ok = await sendDm(activeDm.otherParticipant.userId, trimmed);
      if (!ok) return; // keep the text so the user can retry
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
          userChats={userChats}
          isLoading={chatLoading}
          userChatLoading={userChatLoading}
          activeProjectId={activeProjectId}
          activeDmId={activeDm?.id || null}
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
            isLoading={!!activeDmId && dmsLoading}
            input={input}
            isSending={isSendingDm}
            typingUsers={dmTypingUsers}
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