"use client";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Navbar from "../Component/navbar";
import Header from "../Component/header";
import Dashboard from "../Component/dashboard";
import TableFunction from "../Component/TableFunction";
import Footer from "../Component/Footer";
import SectionPanel from "../Component/SectionPanel";
import { useState } from "react";

export default function BugTracker() {
  const activeSection = useSelector((state: RootState) => state.section.activeSection);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between bg-amber-50 px-4 py-3 border-b border-amber-200">
        <h1 className="text-xl font-bold">Epic Bug Tracker</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-amber-100 transition-colors" aria-label="Toggle sidebar">
          <div className="w-6 h-0.5 bg-gray-700 mb-1" />
          <div className="w-6 h-0.5 bg-gray-700 mb-1" />
          <div className="w-6 h-0.5 bg-gray-700" />
        </button>
      </div>

      <div className="flex flex-1 relative">
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-40 z-20" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`fixed md:static top-0 left-0 min-h-full z-30 w-64 flex-shrink-0 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
          <Navbar />
        </aside>

        <div className="flex-1 bg-gray-100 min-w-0 overflow-auto">
          {activeSection ? (
            <SectionPanel />
          ) : (
            <>
              <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-auto"><Header /></div>
                <div className="flex-1 min-w-0"><Dashboard /></div>
              </div>
              <TableFunction />
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}