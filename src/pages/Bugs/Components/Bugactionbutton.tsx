import React, { useState } from "react";
import { AlertTriangle, ChevronDown, Eye, Pencil, Trash2 } from "lucide-react";
import { Bug } from "@/pages/services/bugs/bugs.api";
// import ConfirmActionModal from "./DeleteProjectModal"; // reuse your existing confirm modal
import { useDeleteBug, useUpdateBugStatus } from "@/pages/services/bugs/useBugs";
import ViewBugModal from "./ViewBugModal";
import UpdateBugModal from "./UpdateBugModal";
import ConfirmActionModal from "@/pages/Project/Components/DeleteProjectModal";

interface BugActionButtonProps {
  item: Bug;
  projectId: string;
  onActionSuccess?: () => void;
}

interface ActionMenuItem {
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
  onClick: () => void;
}

const BugActionButton: React.FC<BugActionButtonProps> = ({
  item,
  projectId,
  onActionSuccess,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
const [activeModal, setActiveModal] = useState<
  "view" | "update" | "delete" | "status" | null
>(null);
const [status, setStatus] = useState("");
const [comment, setComment] = useState("");

const { mutateAsync: updateStatus, isPending: isUpdatingStatus } =
  useUpdateBugStatus(projectId);

  const { mutateAsync: deleteBug, isPending: isDeleting } =
    useDeleteBug(projectId);

  const handleClose = () => setActiveModal(null);

  const handleConfirmDelete = async () => {
    await deleteBug(item.id);
    handleClose();
    onActionSuccess?.();
  };

  const menuItems: ActionMenuItem[] = [
    {
  label: "Update Status",
  icon: <AlertTriangle size={14} />,
  onClick: () => {
    setActiveModal("status");
    setMenuOpen(false);
  },
},
    {
      label: "Update Bug",
      icon: <Pencil size={14} />,
      onClick: () => {
        setActiveModal("update");
        setMenuOpen(false);
      },
    },
    {
      label: "Delete Bug",
      icon: <Trash2 size={14} />,
      danger: true,
      onClick: () => {
        setActiveModal("delete");
        setMenuOpen(false);
      },
    },
  ];

  const handleUpdateStatus = async () => {
  await updateStatus({
    bugId: item.id,
    payload: {
      status,
      comment,
    },
  });

  handleClose();
  onActionSuccess?.();
};

  return (
    <div className="relative">
      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen((prev) => !prev);
        }}
        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
      >
        Action
        <ChevronDown
          size={13}
          className={`transition-transform ${menuOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="absolute left-10 z-20 mt-1 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {menuItems.map((menu) => (
            <button
              key={menu.label}
              type="button"
              onClick={menu.onClick}
              className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                menu.danger
                  ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                  : "text-slate-700 hover:bg-slate-50 dark:text-gray-300 dark:hover:bg-white/5"
              }`}
            >
              {menu.icon}
              {menu.label}
            </button>
          ))}
        </div>
      )}

      {/* View Modal */}
      <ViewBugModal
        isOpen={activeModal === "view"}
        onClose={handleClose}
        bug={item}
      />

      {/* Update Modal */}
      <UpdateBugModal
        isOpen={activeModal === "update"}
        onClose={handleClose}
        bug={item}
        projectId={projectId}
      />

      {/* Delete Confirm Modal */}
      <ConfirmActionModal
  isOpen={activeModal === "status"}
  title="Update Bug Status"
  confirmText="Update Status"
  isLoading={isUpdatingStatus}
  onClose={handleClose}
  onConfirm={handleUpdateStatus}
  description={
    <div className="space-y-4">
      {/* Status select */}
      <div>
        <label className="text-sm font-medium">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">Select status</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="CLOSED">CLOSED</option>
          <option value="DUPLICATE">DUPLICATE</option>
        </select>
      </div>

      {/* Comment */}
      <div>
        <label className="text-sm font-medium">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment (optional)"
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          rows={3}
        />
      </div>
    </div>
  }
/>
    </div>
  );
};

export default BugActionButton;