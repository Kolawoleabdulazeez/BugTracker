import { Search, Loader2, Users, MessageCircle } from "lucide-react";
import { useState } from "react";
import { GroupChatResponse, UserChats } from "@/services/chat/chat.api";
import { GroupListItem } from "./Shared";
import { getAvatarColor, getInitials, relativeTime } from "@/utils/helpers";

type Tab = "group" | "dm";

type Props = {
  chats: GroupChatResponse[];
  userChats: UserChats[];
  isLoading: boolean;
  userChatLoading: boolean;
  activeProjectId: string | null;
  activeDmId: string | null;
  search: string;
  onSearchChange: (val: string) => void;
  onSelectProject: (id: string) => void;
  onSelectDm: (id: string) => void;
  show: boolean;
};

const DmListItem = ({
  chat,
  isActive,
  onClick,
}: {
  chat: UserChats;
  isActive: boolean;
  onClick: () => void;
}) => {
  const color = getAvatarColor(chat.otherParticipant.userId);
  const initials = getInitials(chat.otherParticipant.fullName);
  const lastTime = relativeTime(chat.lastMessageAt);

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
      <div className={`h-10 w-10 rounded-full ${color} flex items-center justify-center text-white text-[11px] font-bold tracking-wide flex-shrink-0`}>
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p className={`text-[13px] font-semibold truncate leading-tight ${
            isActive
              ? "text-orange-600 dark:text-orange-400"
              : "text-slate-800 dark:text-white"
          }`}>
            {chat.otherParticipant.fullName}
          </p>
          <span className="text-[10px] flex-shrink-0 text-slate-400 dark:text-secondary-500">
            {lastTime}
          </span>
        </div>
        <p className="text-xs truncate text-slate-400 dark:text-secondary-500 mt-0.5">
          {chat.lastMessageIsMine ? "You: " : ""}{chat.lastMessageSnippet}
        </p>
      </div>
    </button>
  );
};

export const ChatSidebar = ({
  chats,
  userChats,
  isLoading,
  userChatLoading,
  activeProjectId,
  activeDmId,
  search,
  onSearchChange,
  onSelectProject,
  onSelectDm,
  show,
}: Props) => {
  const [activeTab, setActiveTab] = useState<Tab>("group");

  const filteredGroups = chats.filter((c) =>
    c.projectName.toLowerCase().includes(search.toLowerCase())
  );
  const activeChats = filteredGroups.filter((c) => c.projectStatus !== "Archived");
  const archivedChats = filteredGroups.filter((c) => c.projectStatus === "Archived");

  const filteredDms = userChats.filter((c) =>
    c.otherParticipant.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={`
        w-full sm:w-[280px] lg:w-[350px] flex-shrink-0 flex flex-col
        overflow-hidden glass-panel
        ${!show ? "hidden sm:flex" : "flex"}
      `}
    >
      <div className="flex-shrink-0 px-4 pt-4 pb-3">
        <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight mb-3">
          Messages
        </p>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/[0.05] rounded-lg p-1 mb-3">
          <button
            type="button"
            onClick={() => { setActiveTab("group"); onSearchChange(""); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === "group"
                ? "bg-white dark:bg-white/10 text-slate-800 dark:text-white shadow-sm"
                : "text-slate-400 dark:text-secondary-500 hover:text-slate-600 dark:hover:text-secondary-300"
            }`}
          >
            <Users size={12} />
            Group
            {!isLoading && activeChats.length > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === "group"
                  ? "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400"
                  : "bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-secondary-500"
              }`}>
                {activeChats.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab("dm"); onSearchChange(""); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === "dm"
                ? "bg-white dark:bg-white/10 text-slate-800 dark:text-white shadow-sm"
                : "text-slate-400 dark:text-secondary-500 hover:text-slate-600 dark:hover:text-secondary-300"
            }`}
          >
            <MessageCircle size={12} />
            Chats
            {!userChatLoading && filteredDms.length > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === "dm"
                  ? "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400"
                  : "bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-secondary-500"
              }`}>
                {filteredDms.length}
              </span>
            )}
          </button>
        </div>

        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-secondary-500 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={activeTab === "group" ? "Search projects…" : "Search people…"}
            className="w-full rounded-lg bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.07] pl-8 pr-3 py-2 text-xs text-slate-700 dark:text-gray-300 placeholder-slate-400 dark:placeholder-secondary-600 outline-none focus:border-orange-400 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-500/15 transition"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
        {activeTab === "group" && (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center py-12 gap-2">
                <Loader2 size={16} className="animate-spin text-slate-400 dark:text-secondary-500" />
                <span className="text-xs text-slate-400 dark:text-secondary-500">Loading…</span>
              </div>
            ) : filteredGroups.length === 0 ? (
              <p className="text-center text-xs text-slate-400 dark:text-secondary-500 py-8">No results</p>
            ) : (
              <>
                {activeChats.length > 0 && (
                  <>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 dark:text-secondary-600 px-3 pt-2 pb-1.5">
                      Active
                    </p>
                    {activeChats.map((chat) => (
                      <GroupListItem
                        key={chat.projectId}
                        chat={chat}
                        isActive={activeProjectId === chat.projectId}
                        onClick={() => onSelectProject(chat.projectId)}
                      />
                    ))}
                  </>
                )}
                {archivedChats.length > 0 && (
                  <>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 dark:text-secondary-600 px-3 pt-4 pb-1.5">
                      Archived
                    </p>
                    {archivedChats.map((chat) => (
                      <GroupListItem
                        key={chat.projectId}
                        chat={chat}
                        isActive={activeProjectId === chat.projectId}
                        onClick={() => onSelectProject(chat.projectId)}
                      />
                    ))}
                  </>
                )}
              </>
            )}
          </>
        )}

        {activeTab === "dm" && (
          <>
            {userChatLoading ? (
              <div className="flex items-center justify-center py-12 gap-2">
                <Loader2 size={16} className="animate-spin text-slate-400 dark:text-secondary-500" />
                <span className="text-xs text-slate-400 dark:text-secondary-500">Loading…</span>
              </div>
            ) : filteredDms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                  <MessageCircle size={20} className="text-slate-300 dark:text-secondary-600" />
                </div>
                <p className="text-xs font-semibold text-slate-500 dark:text-secondary-400">
                  No direct messages yet
                </p>
                <p className="text-[11px] text-slate-400 dark:text-secondary-500 leading-relaxed">
                  Start a conversation with a team member.
                </p>
              </div>
            ) : (
              <>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 dark:text-secondary-600 px-3 pt-2 pb-1.5">
                  Direct Messages
                </p>
                {filteredDms.map((chat) => (
                  <DmListItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeDmId === chat.id}
                    onClick={() => onSelectDm(chat.id)}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};