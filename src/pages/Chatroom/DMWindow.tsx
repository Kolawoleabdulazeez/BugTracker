import { useRef, useEffect } from "react";
import {
  Send, MoreVertical, Paperclip, Smile,
  ChevronLeft, Phone, Video,
} from "lucide-react";
import { Message, UserChats } from "@/services/chat/chat.api";
import {
  DateDivider, formatMessageTime, getAvatarColor,
  getInitials, groupByDate,
} from "@/utils/helpers";
import { TypingIndicator } from "./Shared";

type Props = {
  activeDm: UserChats;
  messages: Message[];
  isLoading: boolean;
  input: string;
  isSending: boolean;
  typingUsers: string[];
  show: boolean;
  onBack: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

const DmBubble = ({
  msg,
  isConsecutive,
  isLastInGroup,
}: {
  msg: Message;
  isConsecutive: boolean;
  isLastInGroup: boolean;
}) => (
  <div className={`flex items-end gap-2 ${msg.isMine ? "flex-row-reverse" : "flex-row"}`}>
    {!msg.isMine && (
      <div className="w-7 flex-shrink-0 flex justify-center">
        {!isConsecutive ? (
          <div className={`h-7 w-7 rounded-full ${getAvatarColor(msg.sender.userId)} flex items-center justify-center text-white text-[9px] font-bold`}>
            {getInitials(msg.sender.fullName)}
          </div>
        ) : (
          <div className="h-7 w-7" />
        )}
      </div>
    )}

    <div className={`flex flex-col gap-0.5 max-w-[68%] ${msg.isMine ? "items-end" : "items-start"}`}>
      <div className={`px-3.5 py-2 text-sm leading-relaxed break-words ${
        msg.isMine
          ? "bg-orange-500 text-white rounded-2xl rounded-br-md"
          : "bg-slate-100 dark:bg-white/[0.07] text-slate-800 dark:text-gray-200 rounded-2xl rounded-bl-md"
      }`}>
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
        <span className="text-[10px] text-slate-300 dark:text-secondary-600 px-0.5">
          {formatMessageTime(msg.sentAt)}
        </span>
      )}
    </div>
  </div>
);

export const DMWindow = ({
  activeDm,
  messages,
  isLoading,
  input,
  isSending,
  typingUsers,
  show,
  onBack,
  onInputChange,
  onSend,
  onKeyDown,
}: Props) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { otherParticipant } = activeDm;
  const messageGroups = groupByDate(messages);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }, [messages.length, isLoading]);

  return (
    <div className={`
      flex-1 flex flex-col min-w-0 overflow-hidden glass-panel
      ${show ? "flex" : "hidden sm:flex"}
    `}>
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-white/[0.07]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="sm:hidden p-1.5 -ml-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <ChevronLeft size={17} className="text-slate-500 dark:text-secondary-400" />
          </button>

          <div className={`h-9 w-9 rounded-full ${getAvatarColor(otherParticipant.userId)} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0`}>
            {getInitials(otherParticipant.fullName)}
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              {otherParticipant.fullName}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-secondary-500 mt-0.5">
              {otherParticipant.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {[Phone, Video, MoreVertical].map((Icon, i) => (
            <button key={i} className="p-2 rounded-lg text-slate-400 dark:text-secondary-500 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition">
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`flex items-end gap-2 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-white/5 animate-pulse flex-shrink-0" />
                <div className={`h-9 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse ${i % 2 === 0 ? "w-48" : "w-36"}`} />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3">
            <div className={`h-14 w-14 rounded-full ${getAvatarColor(otherParticipant.userId)} flex items-center justify-center text-white text-lg font-bold`}>
              {getInitials(otherParticipant.fullName)}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-secondary-300">
                {otherParticipant.fullName}
              </p>
              <p className="text-xs text-slate-400 dark:text-secondary-500 mt-1">
                Start a conversation 👋
              </p>
            </div>
          </div>
        ) : (
          messageGroups.map(({ date, messages: msgs }) => (
            <div key={date}>
              <DateDivider label={date} />
              <div className="space-y-2">
                {msgs.map((msg, idx) => {
                  const prevMsg = msgs[idx - 1];
                  return (
                    <DmBubble
                      key={msg.id}
                      msg={msg}
                      isConsecutive={!!prevMsg && prevMsg.sender.userId === msg.sender.userId}
                      isLastInGroup={idx === msgs.length - 1 || msgs[idx + 1]?.sender.userId !== msg.sender.userId}
                    />
                  );
                })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-shrink-0 px-5 min-h-[20px]">
        <TypingIndicator names={typingUsers} />
      </div>

      <div className="flex-shrink-0 px-4 pb-3 pt-1 border-t border-slate-100 dark:border-white/[0.07]">
        <div className="flex items-end gap-2 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.04] px-3 py-2 focus-within:border-orange-400 dark:focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 dark:focus-within:ring-orange-500/15 transition">
          <button type="button" className="flex-shrink-0 p-1 text-slate-400 dark:text-secondary-500 hover:text-slate-600 dark:hover:text-secondary-300 transition">
            <Paperclip size={16} />
          </button>
          <button type="button" className="flex-shrink-0 p-1 text-slate-400 dark:text-secondary-500 hover:text-slate-600 dark:hover:text-secondary-300 transition">
            <Smile size={16} />
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            placeholder={`Message ${otherParticipant.fullName}…`}
            rows={1}
            disabled={isSending}
            className="flex-1 resize-none bg-transparent text-sm text-slate-700 dark:text-gray-200 placeholder-slate-400 dark:placeholder-secondary-600 outline-none disabled:opacity-40 py-1"
            style={{ lineHeight: "1.5", minHeight: "24px" }}
          />
          <button
            type="button"
            onClick={onSend}
            disabled={isSending || !input.trim()}
            className={`flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-lg transition ${
              input.trim()
                ? "bg-orange-500 text-white hover:bg-orange-600 shadow-sm shadow-orange-500/20"
                : "bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-secondary-500 cursor-not-allowed"
            }`}
          >
            {isSending ? (
              <div className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <Send size={14} />
            )}
          </button>
        </div>
        <p className="mt-1.5 text-[10px] text-slate-300 dark:text-secondary-600 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};