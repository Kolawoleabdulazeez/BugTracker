"use client";

import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { bugAdded, bugEdited } from "@/pages/features/bugSlice";
import Image from "next/image";
import Button from "./Button/Button";

type CreateTicketModalProps = {
  mode: "create" | "edit";
  ticketToEdit: any;
  onClose: () => void;
};

export default function CreateTicketModal({ mode, ticketToEdit, onClose }: CreateTicketModalProps) {
  const dispatch = useDispatch();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    module: "",
    title: "",
    status: "",
    priority: "",
    assignee: "",
    attachment: null as File | null,
  });

  const [errors, setErrors] = useState({
    module: "",
    title: "",
    status: "",
    priority: "",
    assignee: "",
  });

  useEffect(() => {
    if (mode === "edit" && ticketToEdit) {
      setFormData({
        module: ticketToEdit.module,
        title: ticketToEdit.description,
        status: ticketToEdit.status,
        priority: ticketToEdit.priority,
        assignee: ticketToEdit.assignee,
        attachment: null, // already stored as base64 string in Redux; don't put it back as File
      });
    }
  }, [mode, ticketToEdit]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type, files } = event.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? (files?.[0] ?? null) : value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function validateForm() {
    const newErrors = {
      module: !formData.module ? "Module is required" : "",
      title: !formData.title ? "Title is required" : "",
      assignee: !formData.assignee ? "Assignee is required" : "",
      status: !formData.status ? "Status is required" : "",
      priority: !formData.priority ? "Priority is required" : "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e !== "");
  }

  // Builds ticket data using a serializable base64 string (or the existing string from edit mode)
  function buildTicketData(attachment: string | null) {
    return {
      id: mode === "edit" && ticketToEdit ? ticketToEdit.id : Date.now(),
      description: formData.title,
      module: formData.module,
      assignee: formData.assignee,
      status: formData.status,
      priority: formData.priority,
      attachment, // ✅ always a string | null — never a File
    };
  }

  function dispatchTicket(ticketData: ReturnType<typeof buildTicketData>) {
    if (mode === "edit" && ticketToEdit) {
      dispatch(bugEdited(ticketData));
    } else {
      dispatch(bugAdded(ticketData));
    }
    onClose();
  }

  function handleAdded() {
    setIsSubmitted(true);
    if (!validateForm()) return;

    if (formData.attachment) {
      // New file selected — convert to base64 before dispatching
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatchTicket(buildTicketData(reader.result as string));
      };
      reader.readAsDataURL(formData.attachment);
    } else {
      // No new file — use existing base64 string from ticketToEdit (edit mode) or null
      const existingAttachment =
        mode === "edit" && ticketToEdit?.attachment ? ticketToEdit.attachment : null;
      dispatchTicket(buildTicketData(existingAttachment));
    }
  }

  const isFormValid = () =>
    formData.module !== "" &&
    formData.title !== "" &&
    formData.status !== "" &&
    formData.priority !== "" &&
    formData.assignee !== "";

  return (
    <div className="fixed inset-0 z-40  flex items-center pointer-events-auto justify-center">
      <div className="bg-white w-full max-w-lg rounded-[10px] p-6 shadow-lg mx-4">
        <div className="mb-4 text-center">
          <span className="font-bold text-blue-500 text-2xl">
            {mode === "edit" ? "Edit Ticket" : "Create New Ticket"}
          </span>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
          {/* Module */}
          <div>
            <label htmlFor="module" className="font-medium text-gray-700 block mb-1">Module</label>
            <input
              type="text"
              id="module"
              name="module"
              value={formData.module}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                isSubmitted && errors.module ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {isSubmitted && errors.module && <p className="text-red-500 text-sm mt-1">{errors.module}</p>}
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block mb-1">Ticket Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                isSubmitted && errors.title ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {isSubmitted && errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block mb-1">Select Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full border ${
                isSubmitted && errors.status ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">-- Choose status --</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            {isSubmitted && errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block mb-1">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={`w-full border ${
                isSubmitted && errors.priority ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Mid">Mid</option>
              <option value="High">High</option>
            </select>
            {isSubmitted && errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority}</p>}
          </div>

          {/* Assignee */}
          <div>
            <label htmlFor="assignee" className="block mb-1">Assignee</label>
            <input
              type="text"
              id="assignee"
              name="assignee"
              value={formData.assignee}
              onChange={handleChange}
              className={`w-full border ${
                isSubmitted && errors.assignee ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {isSubmitted && errors.assignee && <p className="text-red-500 text-sm mt-1">{errors.assignee}</p>}
          </div>

          {/* Attachment */}
          <div>
            <label htmlFor="attachment" className="block mb-1">Attach Screenshots</label>
            {/* Show existing attachment in edit mode */}
            {mode === "edit" && ticketToEdit?.attachment && !formData.attachment && (
              <Image
                src={ticketToEdit.attachment}
                alt="Current attachment"
                className="w-16 h-16 object-cover rounded mb-2"
              />
            )}
            <input
              type="file"
              id="attachment"
              name="attachment"
              accept="image/*"
              onChange={handleChange}
              className="w-full border rounded border-gray-300 px-3 py-2"
            />
          </div>
        </form>

        <div className="flex gap-4 mt-5">
          <Button
          title="Close"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
          />
          <Button
          title={mode === "edit" ? "Edit Ticket" : "Create Ticket"}
            onClick={handleAdded}
            className={`px-4 py-2 ${
              isFormValid() ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"
            } text-white rounded-md transition`}
          />
       
        </div>
      </div>
    </div>
  );
}