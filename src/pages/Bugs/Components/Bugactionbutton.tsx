import React, { useState } from "react";
import { AlertTriangle, Pencil, Trash2, ChevronDown } from "lucide-react";
import { BugType } from "@/services/bugs/bugs.api";
import { useUpdateBugStatus } from "@/services/bugs/useBugs";
import ConfirmActionModal from "@/pages/Project/Components/DeleteProjectModal";
import Modal from "@/Component/Modal/Modal";
import UpdateBugStatusModal from "./UpdateBugStatusModal";
import UpdateBugModal from "./UpdateBugModal";

interface BugActionButtonProps {
  item: BugType;
  projectId: string;
  onActionSuccess?: () => void;
}

const BugActionButton: React.FC<BugActionButtonProps> = ({
  item,
  projectId,
  onActionSuccess,
}) => {
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<
    "update" | "delete" | "status" | null
  >(null);

  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } =
    useUpdateBugStatus(projectId);

  const handleClose = () => setActiveModal(null);

  const handleUpdateStatus = async (status: string, comment: string) => {
    await updateStatus({
      bugId: item.id,
      payload: { status, comment },
    });
    handleClose();
    onActionSuccess?.();
  };

  const actionButtons = [
    {
      label: "Update Status",
      icon: <AlertTriangle size={16} />,
      onClick: () => {
        setActionModalOpen(false);
        setActiveModal("status");
      },
    },
    {
      label: "Update Bug",
      icon: <Pencil size={16} />,
      onClick: () => {
        setActionModalOpen(false);
        setActiveModal("update");
      },
    },
    {
      label: "Delete Bug",
      icon: <Trash2 size={16} />,
      danger: true,
      onClick: () => {
        setActionModalOpen(false);
        setActiveModal("delete");
      },
    },
  ];

  return (
    <div>
      {/* Trigger */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setActionModalOpen(true);
        }}
        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
      >
        Action
        <ChevronDown size={13} />
      </button>

      {/* Action Selection Modal */}
      <Modal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        onOverlayClose={() => setActionModalOpen(false)}
        className="w-[400px] px-0 !bg-white dark:!bg-gray-900"
        headText="Select An Action"
      >
        <div className="w-full gap-3 my-5 flex flex-col items-center px-4">
          {actionButtons.map((btn) => (
            <button
              key={btn.label}
              type="button"
              onClick={btn.onClick}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg font-semibold text-sm transition-colors ${
                btn.danger
                  ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white"
                  : "bg-[#CFF8E0] text-darkPrimary hover:bg-blue-600 hover:text-white dark:bg-white/5 dark:text-gray-200 dark:hover:bg-blue-600 dark:hover:text-white"
              }`}
            >
              {btn.icon}
              <span>{btn.label}</span>
            </button>
          ))}
        </div>
      </Modal>

      {/* Update Status Modal — dedicated component, not ConfirmActionModal */}
      <UpdateBugStatusModal
        isOpen={activeModal === "status"}
        onClose={handleClose}
        onConfirm={handleUpdateStatus}
        isLoading={isUpdatingStatus}
      />

      {/* Update Bug Modal */}
      <UpdateBugModal
        isOpen={activeModal === "update"}
        onClose={handleClose}
        bug={item}
        projectId={projectId}
      />

      {/* Delete Confirm Modal */}
      <ConfirmActionModal
        isOpen={activeModal === "delete"}
        title="Delete Bug"
        confirmText="Delete"
        isLoading={false}
        onClose={handleClose}
        onConfirm={() => {
          // TODO: wire up delete mutation
          handleClose();
          onActionSuccess?.();
        }}
        description="Are you sure you want to delete this bug? This action cannot be undone."
      />
    </div>
  );
};

export default BugActionButton;