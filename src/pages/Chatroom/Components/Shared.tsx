import { GroupChatResponse, GroupMessages } from "@/services/chat/chat.api";
import { formatMessageTime, getAvatarColor, getInitials, relativeTime } from "@/utils/helpers";
import { Hash, Users } from "lucide-react";

export const GroupListItem = ({
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
          ? "bg-orange-50 dark:bg-orange-500/15"
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
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-slate-800 dark:text-white"
              } ${isArchived ? "opacity-50" : ""}`}
            >
              {chat.projectName}
            </p>
            {isArchived && (
              <span className="flex-shrink-0 text-[9px] font-semibold uppercase tracking-wide text-slate-400 dark:text-secondary-500 bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded-full">
                Archived
              </span>
            )}
          </div>
          <span className="text-[10px] flex-shrink-0 text-slate-400 dark:text-secondary-500">
            {lastTime}
          </span>
        </div>
        <div className="flex items-center justify-between gap-1 mt-0.5">
          <p className="text-xs truncate text-slate-400 dark:text-secondary-500">
            {chat.lastMessage
              ? `${chat.lastMessage.isMine ? "You: " : ""}${lastText}`
              : lastText}
          </p>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Users size={9} className="text-slate-300 dark:text-secondary-600" />
            <span className="text-[10px] text-slate-300 dark:text-secondary-600">
              {chat.memberCount}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export const EmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-center px-10 select-none">
    <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-3 ring-1 ring-slate-200 dark:ring-white/10">
      <Hash size={22} className="text-slate-300 dark:text-secondary-600" />
    </div>
    <p className="text-sm font-semibold text-slate-600 dark:text-secondary-300 mb-1">
      No conversation open
    </p>
    <p className="text-xs text-slate-400 dark:text-secondary-500 leading-relaxed">
      Pick a project group from the left to start chatting with your team.
    </p>
  </div>
);

export const TypingIndicator = ({ names }: { names: string[] }) => {
  if (names.length === 0) return null;
  const label =
    names.length === 1
      ? `${names[0]} is typing`
      : names.length === 2
      ? `${names[0]} and ${names[1]} are typing`
      : "Several people are typing";

  return (
    <div className="flex items-center gap-2 px-1 pb-1">
      <div className="flex items-center gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-orange-400 dark:bg-orange-400/60 animate-bounce"
            style={{ animationDelay: `${i * 150}ms`, animationDuration: "0.9s" }}
          />
        ))}
      </div>
      <span className="text-[11px] text-slate-400 dark:text-secondary-500 italic">
        {label}…
      </span>
    </div>
  );
};

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
        <span className="text-[11px] font-medium text-slate-400 dark:text-secondary-500 px-0.5 mb-0.5">
          {msg.sender.fullName}
        </span>
      )}

      <div
        className={`px-3.5 py-2 text-sm leading-relaxed break-words ${
          msg.isMine
            ? "bg-orange-500 text-white rounded-2xl rounded-br-md"
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
        <span className="text-[10px] text-slate-300 dark:text-secondary-600 px-0.5">
          {formatMessageTime(msg.sentAt)}
        </span>
      )}
    </div>
  </div>
);

export default MessageBubble