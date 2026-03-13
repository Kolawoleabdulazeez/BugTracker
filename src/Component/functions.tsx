"use client";

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import TicketModal from "./TicketModal";
import { RootState } from "@/pages/store";
import { openCreateModal } from "@/pages/features/modalSlice";

type Props = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

export default function Functions({ searchTerm, setSearchTerm }: Props) {
  const dispatch = useDispatch();
  const bugs = useSelector((state: RootState) => state.bugs);
  const [showSearch, setShowSearch] = useState(false);

  function handleModal() {
    dispatch(openCreateModal());
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-white">
      {/* Row 1: Title + ticket count + quick add */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="font-semibold text-gray-800 text-lg">Android</h2>
          <span className="text-xs bg-gray-100 px-2 py-1.5 rounded text-gray-600">
            {bugs.length} Tickets
          </span>
          <button className="transition-transform duration-150 active:scale-95 flex items-center text-sm text-sky-500 font-medium">
            <span className="text-xl">➕</span>
            <span className="ml-1">Quick Add</span>
          </button>
        </div>

        {/* Mobile: search toggle */}
        <button
          className="md:hidden p-2 rounded-md bg-gray-100 text-gray-600"
          onClick={() => setShowSearch((v) => !v)}
          aria-label="Toggle search"
        >
          🔍
        </button>
      </div>

      {/* Row 2: Search (always visible md+, toggleable on mobile) */}
      <div className={`${showSearch ? "flex" : "hidden"} md:flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-wrap`}>
        {/* Search bar */}
        <div className="flex items-center bg-gray-100 px-2 py-2 rounded-md border w-full sm:w-auto sm:flex-1 sm:max-w-sm md:max-w-md">
          <input
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            placeholder="Search by Bug ID/Ticket Title"
            className="bg-transparent outline-none text-sm px-1 w-full"
          />
          <span className="text-gray-500 text-sm ml-1">🔍</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleModal}
            className="transition-transform duration-150 active:scale-95 border border-sky-500 text-sky-500 text-sm rounded-md px-3 py-2 flex items-center whitespace-nowrap"
          >
            ✏️ <span className="ml-1">Create Ticket</span>
          </button>

          <button className="transition-transform duration-150 active:scale-95 relative bg-gray-100 px-3 py-2 rounded-md text-sm text-gray-700 flex items-center whitespace-nowrap">
            ⚙️ <span className="ml-1">Filter</span>
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-sky-500"></span>
          </button>

          <button className="transition-transform duration-150 active:scale-95 bg-gray-100 px-3 py-2 rounded-md text-sm text-gray-700 flex items-center whitespace-nowrap">
            📤 <span className="ml-1">Export</span>
          </button>
        </div>
      </div>

      <TicketModal />
    </div>
  );
}