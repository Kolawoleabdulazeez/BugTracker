import PageLayout from "@/Component/Layout/PageLayout";
import React, { useEffect, useRef, useState } from "react";
import {
  Send,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  ChevronLeft,
  Users,
  Phone,
  Video,
  Hash,
  Loader2,
} from "lucide-react";
import { useGetGroupChats, useGetChatMessages } from "@/services/chat/useChat";
import { GroupChatResponse, GroupMessages } from "@/services/chat/chat.api";
import {
  DateDivider,
  formatMessageTime,
  getAvatarColor,
  getInitials,
  groupByDate,
  relativeTime,
} from "@/utils/helpers";
import { useChatSocket } from "@/services/socket/useSignal";

// ─── Sidebar item ─────────────────────────────────────────────────────────────
const GroupListItem = ({
  chat,
  isActive,
  onClick,
}: {
  chat: GroupChatResponse;
  isActive: boolean;
  onClick: () => void;
}) => {
  const color = getAvatarColor(chat.projectId);
  const initials = getInitials(chat.projectName);
  const lastText = chat.lastMessage?.content ?? "No messages yet";
  const lastTime = relativeTime(chat.lastActivityAt);
  const isArchived = chat.projectStatus === "Archived";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
        isActive
          ? "bg-blue-50 dark:bg-blue-500/15"
          : "hover:bg-slate-50 dark:hover:bg-white/[0.04]"
      }`}
    >
      <div className="relative flex-shrink-0">
        <div
          className={`h-10 w-10 rounded-xl ${color} flex items-center justify-center text-white text-[11px] font-bold tracking-wide ${
            isArchived ? "opacity-50" : ""
          }`}
        >
          {initials}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <p
              className={`text-[13px] font-semibold truncate leading-tight ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-800 dark:text-white"
              } ${isArchived ? "opacity-50" : ""}`}
            >
              {chat.projectName}
            </p>
            {isArchived && (
              <span className="flex-shrink-0 text-[9px] font-semibold uppercase tracking-wide text-slate-400 dark:text-white/30 bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded-full">
                Archived
              </span>
            )}
          </div>
          <span className="text-[10px] flex-shrink-0 text-slate-400 dark:text-white/30">
            {lastTime}
          </span>
        </div>
        <div className="flex items-center justify-between gap-1 mt-0.5">
          <p className="text-xs truncate text-slate-400 dark:text-white/40">
            {chat.lastMessage
              ? `${chat.lastMessage.isMine ? "You: " : ""}${lastText}`
              : lastText}
          </p>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Users size={9} className="text-slate-300 dark:text-white/20" />
            <span className="text-[10px] text-slate-300 dark:text-white/25">
              {chat.memberCount}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-center px-10 select-none">
    <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-3 ring-1 ring-slate-200 dark:ring-white/10">
      <Hash size={22} className="text-slate-300 dark:text-white/20" />
    </div>
    <p className="text-sm font-semibold text-slate-600 dark:text-white/60 mb-1">
      No conversation open
    </p>
    <p className="text-xs text-slate-400 dark:text-white/30 leading-relaxed">
      Pick a project group from the left to start chatting with your team.
    </p>
  </div>
);

// ─── Typing indicator ─────────────────────────────────────────────────────────
const TypingIndicator = ({ names }: { names: string[] }) => {
  if (names.length === 0) return null;
  const label =
    names.length === 1
      ? `${names[0]} is typing`
      : names.length === 2
      ? `${names[0]} and ${names[1]} are typing`
      : "Several people are typing";

  return (
    <div className="flex items-center gap-2 px-1 pb-1">
      {/* Animated dots */}
      <div className="flex items-center gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-white/30 animate-bounce"
            style={{ animationDelay: `${i * 150}ms`, animationDuration: "0.9s" }}
          />
        ))}
      </div>
      <span className="text-[11px] text-slate-400 dark:text-white/30 italic">
        {label}…
      </span>
    </div>
  );
};

// ─── Message bubble ───────────────────────────────────────────────────────────
const MessageBubble = ({
  msg,
  isConsecutive,
  isLastInGroup,
}: {
  msg: GroupMessages;
  isConsecutive: boolean;
  isLastInGroup: boolean;
}) => (
  <div
    className={`flex items-end gap-2 ${msg.isMine ? "flex-row-reverse" : "flex-row"}`}
  >
    {!msg.isMine && (
      <div className="w-7 flex-shrink-0 flex justify-center">
        {!isConsecutive ? (
          <div
            className={`h-7 w-7 rounded-full ${getAvatarColor(
              msg.sender.userId
            )} flex items-center justify-center text-white text-[9px] font-bold`}
          >
            {getInitials(msg.sender.fullName)}
          </div>
        ) : (
          <div className="h-7 w-7" />
        )}
      </div>
    )}

    <div
      className={`flex flex-col gap-0.5 max-w-[68%] ${
        msg.isMine ? "items-end" : "items-start"
      }`}
    >
      {!msg.isMine && !isConsecutive && (
        <span className="text-[11px] font-medium text-slate-400 dark:text-white/40 px-0.5 mb-0.5">
          {msg.sender.fullName}
        </span>
      )}

      <div
        className={`px-3.5 py-2 text-sm leading-relaxed break-words ${
          msg.isMine
            ? "bg-blue-600 text-white rounded-2xl rounded-br-md"
            : "bg-slate-100 dark:bg-white/[0.07] text-slate-800 dark:text-gray-200 rounded-2xl rounded-bl-md"
        }`}
      >
        {msg.isDeleted ? (
          <span className="italic opacity-50">Message deleted</span>
        ) : (
          <>
            {msg.content}
            {msg.isEdited && (
              <span className="ml-1.5 text-[10px] opacity-50">(edited)</span>
            )}
          </>
        )}
      </div>

      {isLastInGroup && (
        <span className="text-[10px] text-slate-300 dark:text-white/20 px-0.5">
          {formatMessageTime(msg.sentAt)}
        </span>
      )}
    </div>
  </div>
);

// ─── Chats Page ───────────────────────────────────────────────────────────────
const Chats = () => {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── API ────────────────────────────────────────────────────────────────────
  const { data: groupChats = [], isLoading: chatLoading } = useGetGroupChats();
  const { data: chatMessages = [], isLoading: messagesLoading } =
    useGetChatMessages(activeProjectId ?? undefined);

  // ── Socket — join room, listen for messages + typing, expose sendMessage ──
  const { sendMessage, isSending, typingUsers, handleTypingKeystroke } =
    useChatSocket(activeProjectId ?? undefined);

  // ── Derived ────────────────────────────────────────────────────────────────
  const activeChat = (groupChats as GroupChatResponse[]).find(
    (c) => c.projectId === activeProjectId
  );

  const filteredChats = (groupChats as GroupChatResponse[]).filter((c) =>
    c.projectName.toLowerCase().includes(search.toLowerCase())
  );

  const activeChats = filteredChats.filter((c) => c.projectStatus !== "Archived");
  const archivedChats = filteredChats.filter((c) => c.projectStatus === "Archived");
  const messageGroups = groupByDate(chatMessages as GroupMessages[]);
  const isArchived = activeChat?.projectStatus === "Archived";

  // Scroll to bottom when messages arrive
  useEffect(() => {
    if (!messagesLoading) {
      setTimeout(
        () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
        50
      );
    }
  }, [chatMessages.length, messagesLoading, activeProjectId]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
    setShowMobileSidebar(false);
    setInput("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
    // Emit typing event to room
    handleTypingKeystroke();
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || !activeProjectId || isSending || isArchived) return;
    sendMessage(trimmed);
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
    <PageLayout
      title="Chatroom"
      showSearch={false}
      contentClassName="bg-slate-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="flex h-[calc(100vh-64px)] p-4 gap-3 overflow-hidden">

        {/* ── LEFT SIDEBAR ──────────────────────────────────────────────── */}
        <div
          className={`
            w-full sm:w-[280px] lg:w-[300px] flex-shrink-0 flex flex-col
            rounded-2xl overflow-hidden
            bg-white dark:bg-[#1a1d2e]
            border border-slate-200/70 dark:border-white/[0.07]
            shadow-sm
            ${!showMobileSidebar ? "hidden sm:flex" : "flex"}
          `}
        >
          <div className="flex-shrink-0 px-4 pt-4 pb-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                Messages
              </p>
              {!chatLoading && (
                <span className="text-[11px] font-semibold text-slate-400 dark:text-white/30 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
                  {activeChats.length}
                </span>
              )}
            </div>

            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 pointer-events-none"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects…"
                className="w-full rounded-lg bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.07] pl-8 pr-3 py-2 text-xs text-slate-700 dark:text-gray-300 placeholder-slate-400 dark:placeholder-white/25 outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/15 transition"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
            {chatLoading ? (
              <div className="flex items-center justify-center py-12 gap-2">
                <Loader2
                  size={16}
                  className="animate-spin text-slate-400 dark:text-white/30"
                />
                <span className="text-xs text-slate-400 dark:text-white/30">
                  Loading…
                </span>
              </div>
            ) : filteredChats.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-8">
                No results
              </p>
            ) : (
              <>
                {activeChats.length > 0 && (
                  <>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 dark:text-white/20 px-3 pt-2 pb-1.5">
                      Active
                    </p>
                    {activeChats.map((chat) => (
                      <GroupListItem
                        key={chat.projectId}
                        chat={chat}
                        isActive={activeProjectId === chat.projectId}
                        onClick={() => handleSelectProject(chat.projectId)}
                      />
                    ))}
                  </>
                )}
                {archivedChats.length > 0 && (
                  <>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 dark:text-white/20 px-3 pt-4 pb-1.5">
                      Archived
                    </p>
                    {archivedChats.map((chat) => (
                      <GroupListItem
                        key={chat.projectId}
                        chat={chat}
                        isActive={activeProjectId === chat.projectId}
                        onClick={() => handleSelectProject(chat.projectId)}
                      />
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT: CHAT WINDOW ────────────────────────────────────────── */}
        <div
          className={`
            flex-1 flex flex-col min-w-0
            rounded-2xl overflow-hidden
            bg-white dark:bg-[#1a1d2e]
            border border-slate-200/70 dark:border-white/[0.07]
            shadow-sm
            ${showMobileSidebar ? "hidden sm:flex" : "flex"}
          `}
        >
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-white/[0.07]">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowMobileSidebar(true)}
                    className="sm:hidden p-1.5 -ml-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10"
                  >
                    <ChevronLeft size={17} className="text-slate-500 dark:text-white/50" />
                  </button>

                  <div
                    className={`h-9 w-9 rounded-xl ${getAvatarColor(
                      activeChat.projectId
                    )} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0`}
                  >
                    {getInitials(activeChat.projectName)}
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {activeChat.projectName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Users size={10} className="text-slate-400 dark:text-white/30" />
                      <span className="text-[11px] text-slate-400 dark:text-white/40">
                        {activeChat.memberCount} members
                      </span>
                      {isArchived && (
                        <>
                          <span className="text-slate-300 dark:text-white/20">·</span>
                          <span className="text-[10px] text-slate-400 dark:text-white/30 bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                            Archived
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-lg text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition">
                    <Phone size={16} />
                  </button>
                  <button className="p-2 rounded-lg text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition">
                    <Video size={16} />
                  </button>
                  <button className="p-2 rounded-lg text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {messagesLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex items-end gap-2 ${
                          i % 2 === 0 ? "flex-row" : "flex-row-reverse"
                        }`}
                      >
                        <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-white/5 animate-pulse flex-shrink-0" />
                        <div
                          className={`h-9 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse ${
                            i % 2 === 0 ? "w-48" : "w-36"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                ) : chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center gap-2">
                    <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                      <Hash size={20} className="text-slate-300 dark:text-white/20" />
                    </div>
                    <p className="text-sm text-slate-400 dark:text-white/30">
                      No messages yet — say hello 👋
                    </p>
                  </div>
                ) : (
                  <div>
                    {messageGroups.map(({ date, messages }) => (
                      <div key={date}>
                        <DateDivider label={date} />
                        <div className="space-y-2">
                          {messages.map((msg, idx) => {
                            const prevMsg = messages[idx - 1];
                            const isConsecutive =
                              !!prevMsg &&
                              prevMsg.sender.userId === msg.sender.userId;
                            const isLastInGroup =
                              idx === messages.length - 1 ||
                              messages[idx + 1]?.sender.userId !==
                                msg.sender.userId;

                            return (
                              <MessageBubble
                                key={msg.id}
                                msg={msg}
                                isConsecutive={isConsecutive}
                                isLastInGroup={isLastInGroup}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Typing indicator — sits just above the compose box */}
              <div className="flex-shrink-0 px-5 min-h-[20px]">
                <TypingIndicator names={typingUsers} />
              </div>

              {/* Compose Box */}
              <div className="flex-shrink-0 px-4 pb-3 pt-1 border-t border-slate-100 dark:border-white/[0.07]">
                <div className="flex items-end gap-2 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.04] px-3 py-2 focus-within:border-blue-400 dark:focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-500/15 transition">
                  <button
                    type="button"
                    className="flex-shrink-0 p-1 text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/60 transition"
                  >
                    <Paperclip size={16} />
                  </button>
                  <button
                    type="button"
                    className="flex-shrink-0 p-1 text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/60 transition"
                  >
                    <Smile size={16} />
                  </button>
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      isArchived
                        ? "Archived project — messaging disabled"
                        : "Message the team… (Enter to send)"
                    }
                    rows={1}
                    disabled={isSending || isArchived}
                    className="flex-1 resize-none bg-transparent text-sm text-slate-700 dark:text-gray-200 placeholder-slate-400 dark:placeholder-white/25 outline-none disabled:opacity-40 py-1"
                    style={{ lineHeight: "1.5", minHeight: "24px" }}
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={isSending || !input.trim() || isArchived}
                    className={`flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-lg transition ${
                      input.trim() && !isArchived
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20"
                        : "bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-white/25 cursor-not-allowed"
                    }`}
                  >
                    {isSending ? (
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                  </button>
                </div>

                <p className="mt-1.5 text-[10px] text-slate-300 dark:text-white/20 text-center">
                  {isArchived
                    ? "This project is archived — messaging is disabled"
                    : "Enter to send · Shift+Enter for new line"}
                </p>
              </div>
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Chats;