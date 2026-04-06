import React, { useState } from "react";
import { Send, Loader2, MessageSquare } from "lucide-react";
import { usePostComment } from "@/services/bugs/useBugs";
import { Comment } from "@/services/bugs/bugs.api";
import { formatDate, getInitials } from "@/utils/helpers";

interface CommentsSectionProps {
  comments: Comment[];
  bugId: string;
  projectId: string;
}




const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-rose-500",
];

function avatarColor(userId: string) {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) hash += userId.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  projectId,
  bugId,
}) => {
  const [content, setContent] = useState("");

  // onSuccessCallback clears the textarea only on confirmed success, not on error
  const { mutateAsync: postComment, isPending } = usePostComment(
    bugId,
    projectId,
    () => setContent("")
  );

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    await postComment({ content: trimmed });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-sm shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 dark:border-white/10">
        <MessageSquare size={16} className="text-slate-400" />
        <p className="text-base font-semibold dark:text-white text-slate-900">
          Comments
        </p>
        {comments.length > 0 && (
          <span className="ml-1 inline-flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            {comments.length}
          </span>
        )}
      </div>

      {/* Comment list */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 max-h-80">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <MessageSquare
              size={28}
              className="text-slate-300 dark:text-slate-600 mb-2"
            />
            <p className="text-sm text-slate-400 dark:text-slate-500">
              No comments yet. Be the first to comment.
            </p>
          </div>
        ) : (
          comments.map((comment: Comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <div
                className={`h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center text-white text-xs font-bold ${avatarColor(
                  comment.id
                )}`}
              >
                {getInitials(comment.authorName)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-semibold dark:text-white text-slate-800 truncate">
                    {comment.authorName ?? "Unknown"}
                  </span>
                  <span className="text-xs text-slate-400 flex-shrink-0">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <div className="rounded-xl rounded-tl-none bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-3 py-2.5">
                  <p className="text-sm dark:text-slate-300 text-slate-700 whitespace-pre-wrap break-words leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Compose box */}
      <div className="px-5 py-4 border-t border-slate-100 dark:border-white/10">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a comment… (⌘ + Enter to send)"
            rows={2}
            disabled={isPending}
            className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-200 dark:placeholder-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isPending || !content.trim()}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            title="Send comment"
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </form>
        <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-600">
          Press ⌘ + Enter to send
        </p>
      </div>
    </div>
  );
};

export default CommentsSection;