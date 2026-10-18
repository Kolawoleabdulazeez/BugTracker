"use client";

import { useState } from "react";
import PageLayout from "@/Component/Layout/PageLayout";
import { TalentBrowse } from "@/Component/Talent/TalentBrowse";
import { ProfileForm } from "@/Component/Talent/ProfileForm";


const TABS = [
  ["browse", "BROWSE"],
  ["mine", "MY PROFILE"],
] as const;

export default function TalentPage() {
  const [tab, setTab] = useState<"browse" | "mine">("browse");

  return (
    <PageLayout title="Talent" showSearch={false}>
      <div className="mb-5 flex gap-1 border-b border-slate-200 dark:border-white/[0.06]">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`cursor-pointer border-0 border-b-2 bg-transparent px-4 py-2.5 text-[10px] font-bold tracking-[0.1em] transition-colors ${
              tab === key
                ? "border-orange-500 text-orange-600 dark:text-orange-400"
                : "border-transparent text-slate-400 hover:text-slate-600 dark:text-secondary-500 dark:hover:text-secondary-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "browse" ? <TalentBrowse /> : <ProfileForm />}
    </PageLayout>
  );
}