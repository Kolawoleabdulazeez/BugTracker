"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PortfolioItem } from "@/services/profile/profile.api";
import {
  useAddPortfolioItem,
  useDeletePortfolioItem,
  useUpdatePortfolioItem,
} from "@/services/profile/useProfile";
import { PortfolioFormValues, PortfolioItemModal } from "./PortfolioItemModal";

const iconBtn =
  "flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-secondary-400 dark:hover:bg-white/[0.1]";

const ItemRow = ({
  item,
  onEdit,
}: {
  item: PortfolioItem;
  onEdit: () => void;
}) => {
  const [confirming, setConfirming] = useState(false);
  const { mutate: remove, isPending } = useDeletePortfolioItem();

  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 3000);
    return () => clearTimeout(t);
  }, [confirming]);

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-white/[0.06] dark:bg-white/[0.02] ${
        isPending ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="m-0 text-[13px] font-medium text-slate-800 dark:text-slate-200">
          {item.projectName}
          {item.role && <span className="text-slate-400"> · {item.role}</span>}
        </p>
        <p className="m-0 mt-0.5 text-[10px] text-slate-400 dark:text-secondary-500">{item.duration}</p>
        {item.description && (
          <p className="m-0 mt-1.5 text-[11px] leading-snug text-slate-500 dark:text-secondary-400">
            {item.description}
          </p>
        )}
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block text-[10px] text-orange-600 hover:underline dark:text-orange-400"
          >
            View project
          </a>
        )}
      </div>

      <div className="flex flex-shrink-0 items-center gap-1.5">
        <button type="button" aria-label="Edit experience" onClick={onEdit} className={iconBtn}>
          <Pencil size={13} />
        </button>
        {confirming ? (
          <button
            type="button"
            onClick={() => {
              setConfirming(false);
              remove(item.itemId);
            }}
            className="flex h-7 cursor-pointer items-center gap-1 rounded-md border border-danger-600 bg-danger-600 px-2 text-[10px] font-bold text-white"
          >
            <Trash2 size={12} /> Confirm?
          </button>
        ) : (
          <button
            type="button"
            aria-label="Remove experience"
            onClick={() => setConfirming(true)}
            className={`${iconBtn} !text-danger-600 hover:!bg-danger-500/10 dark:!text-danger-400`}
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
};

export const PortfolioSection = ({
  items,
  canEdit,
}: {
  items: PortfolioItem[];
  canEdit: boolean;
}) => {
  const [modal, setModal] = useState<null | "add" | PortfolioItem>(null);
  const close = () => setModal(null);

  const { mutate: add, isPending: adding } = useAddPortfolioItem(close);
  const { mutate: update, isPending: updating } = useUpdatePortfolioItem(close);

  const handleSave = (v: PortfolioFormValues) => {
    const base = {
      projectName: v.projectName,
      role: v.role,
      description: v.description,
      link: v.link,
    };

    if (modal === "add") {
      add({
        ...base,
        startDate: new Date(v.startDate).toISOString(),
        endDate: v.current ? null : new Date(v.endDate).toISOString(),
      });
    } else if (modal) {
      // PATCH takes a display string, same format the API returns
      update({
        itemId: modal.itemId,
        payload: {
          ...base,
          duration: `${v.startDate} - ${v.current ? "present" : v.endDate}`,
        },
      });
    }
  };

  return (
    <div className="glass-card flex flex-col gap-4 rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <p className="m-0 text-[10px] font-bold tracking-[0.12em] text-slate-500 dark:text-secondary-500">
          EXPERIENCE
        </p>
        <button
          type="button"
          disabled={!canEdit}
          onClick={() => setModal("add")}
          className="flex cursor-pointer items-center gap-1 border-none bg-transparent text-[10px] text-orange-600 disabled:cursor-not-allowed disabled:opacity-40 dark:text-orange-400"
        >
          <Plus size={11} /> add experience
        </button>
      </div>

      {!canEdit && (
        <p className="m-0 text-[11px] text-slate-400 dark:text-secondary-500">
          Create your profile first, then add experience.
        </p>
      )}

      {canEdit && items.length === 0 && (
        <p className="m-0 text-[11px] text-slate-400 dark:text-secondary-500">
          Add projects you have tested so owners can see your track record.
        </p>
      )}

      {items.map((item) => (
        <ItemRow key={item.itemId} item={item} onEdit={() => setModal(item)} />
      ))}

      {modal && (
        <PortfolioItemModal
          item={modal === "add" ? null : modal}
          isSaving={adding || updating}
          onClose={close}
          onSave={handleSave}
        />
      )}
    </div>
  );
};