"use client";

import { useState } from "react";
import { Briefcase, Loader2, MapPin, MessageCircle, Search, X } from "lucide-react";
import { useGetProfileById, useSearchProfiles } from "@/services/profile/useProfile";
import {
  AVAILABILITY_LABEL,
  AVAILABILITY_OPTIONS,
  AvailabilityStatus,
  EMPLOYMENT_LABEL,
  EMPLOYMENT_OPTIONS,
  EmploymentTypePreference,
  WORK_TYPE_LABEL,
  WORK_TYPE_OPTIONS,
  WorkTypePreference,
  dmHref,
  getAvailabilityDot,
  getAvailabilityLabel,
  getInitials,
} from "@/utils";
import { useRouter } from "next/router";
import { getAuthFromStorage } from "@/utils/lib";

function FilterRow<T extends string>({
  label,
  value,
  options,
  onChange,
  labels,
}: {
  label: string;
  value: T | null;
  options: readonly T[];
  onChange: (v: T | null) => void;
  labels?: Partial<Record<T, string>>;
}) {
  const cls = (active: boolean) =>
    `flex-shrink-0 cursor-pointer rounded-[7px] border px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.07em] transition-all duration-100 ${
      active
        ? "border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400"
        : "border-slate-200 bg-transparent text-slate-500 dark:border-white/[0.05] dark:text-secondary-500"
    }`;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
      <span className="w-20 flex-shrink-0 text-[9px] font-bold tracking-[0.1em] text-slate-400 dark:text-secondary-500">
        {label}
      </span>
      <button className={cls(value === null)} onClick={() => onChange(null)}>
        All
      </button>
      {options.map((o) => (
        <button key={o} className={cls(value === o)} onClick={() => onChange(o)}>
          {labels?.[o] ?? o}
        </button>
      ))}
    </div>
  );
}

function ProfileDetailModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const { data: p, isLoading, isError } = useGetProfileById(userId);
  const router = useRouter();
  const myId = getAuthFromStorage()?.user?.id;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-md"
    >
      <div className="w-full max-w-[560px] overflow-hidden rounded-2xl border border-white/20 bg-white/95 shadow-[0_40px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl dark:border-white/[0.08] dark:bg-secondary-900/95 dark:shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-[18px] dark:border-white/[0.06]">
          <p className="m-0 text-[13px] font-bold text-slate-900 dark:text-[#e2e8f0]">
            {p?.fullName ?? "Profile"}
          </p>
          <div className="flex items-center gap-2">
            {p && p.userId !== myId && (
              <button
                onClick={() => router.push(dmHref(p))}
                className="flex cursor-pointer items-center gap-1.5 rounded-[7px] border border-orange-500/40 bg-orange-500 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-orange-600"
              >
                <MessageCircle size={12} /> Message
              </button>
            )}
            <button
              onClick={onClose}
              className="flex cursor-pointer items-center rounded-[7px] border border-slate-200 bg-slate-50 p-[5px_7px] text-slate-400 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-[#475569]"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={20} className="animate-spin text-slate-400" />
          </div>
        ) : isError || !p ? (
          <p className="m-0 py-16 text-center text-[13px] text-slate-400">
            Could not load this profile.
          </p>
        ) : (
          <div className="flex max-h-[65vh] flex-col gap-4 overflow-y-auto px-6 py-6">
            <div>
              <p className="m-0 text-[14px] font-semibold text-slate-800 dark:text-slate-200">
                {p.headline}
              </p>
              <p className="m-0 mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-secondary-400">
                <span className={`h-1.5 w-1.5 rounded-full ${getAvailabilityDot(p.availabilityStatus)}`} />
                {getAvailabilityLabel(p.availabilityStatus)}
                {p.yearsOfExperience > 0 && ` · ${p.yearsOfExperience} yrs`}
                {p.workTypePreference && ` · ${WORK_TYPE_LABEL[p.workTypePreference] ?? p.workTypePreference}`}
                {p.employmentTypePreference &&
                  ` · ${EMPLOYMENT_LABEL[p.employmentTypePreference] ?? p.employmentTypePreference}`}
              </p>
            </div>

            {p.bio && (
              <p className="m-0 text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">{p.bio}</p>
            )}

            {p.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {p.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-orange-500/[0.15] bg-orange-500/[0.07] px-2.5 py-1 text-[11px] capitalize text-orange-600 dark:text-orange-400"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            {p.rateOrSalaryExpectation && (
              <p className="m-0 text-[12px] text-slate-600 dark:text-slate-300">
                <span className="mr-1.5 text-[9px] font-bold tracking-[0.1em] text-slate-400">RATE</span>
                {p.rateOrSalaryExpectation}
              </p>
            )}

            {p.portfolioItems?.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="m-0 text-[9px] font-bold tracking-[0.1em] text-slate-400 dark:text-[#334155]">
                  EXPERIENCE
                </p>
                {p.portfolioItems.map((e) => (
                  <div
                    key={e.itemId}
                    className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 dark:border-white/[0.06] dark:bg-white/[0.02]"
                  >
                    <p className="m-0 text-[12px] font-medium text-slate-800 dark:text-slate-200">
                      {e.projectName}
                      {e.role && <span className="text-slate-400"> · {e.role}</span>}
                    </p>
                    {e.duration && (
                      <p className="m-0 mt-0.5 text-[10px] text-slate-400 dark:text-secondary-500">
                        {e.duration}
                      </p>
                    )}
                    {e.description && (
                      <p className="m-0 mt-0.5 text-[11px] text-slate-500 dark:text-secondary-400">
                        {e.description}
                      </p>
                    )}
                    {e.link && (
                      <a
                        href={e.link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block text-[10px] text-orange-600 hover:underline dark:text-orange-400"
                      >
                        View project
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            {p.socialLinks && (
              <div className="flex flex-wrap gap-3 text-[11px]">
                {Object.entries(p.socialLinks)
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <a
                      key={k}
                      href={v}
                      target="_blank"
                      rel="noreferrer"
                      className="text-orange-600 hover:underline dark:text-orange-400"
                    >
                      {k}
                    </a>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const TalentBrowse = () => {
  const [availability, setAvailability] = useState<AvailabilityStatus | null>(null);
  const [employment, setEmployment] = useState<EmploymentTypePreference | null>(null);
  const [workType, setWorkType] = useState<WorkTypePreference | null>(null);
  const [search, setSearch] = useState("");
  const [openUserId, setOpenUserId] = useState<string | null>(null);
  const router = useRouter();
  const myId = getAuthFromStorage()?.user?.id;

  const { data, isLoading, isError, isFetching } = useSearchProfiles({
    availabilityStatus: availability,
    employmentType: employment,
    workType,
  });

  // GET /Profile/jobs response is not confirmed yet, so this stays loose.
  // Replace with the real type once you paste the response.
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const all: any[] = Array.isArray(data)
    ? data
    : data?.profiles ?? data?.items ?? data?.users ?? [];

  const q = search.trim().toLowerCase();
  const profiles = q
    ? all.filter(
        (p) =>
          p.fullName?.toLowerCase().includes(q) ||
          p.headline?.toLowerCase().includes(q) ||
          p.skills?.some((s: string) => s.toLowerCase().includes(q))
      )
    : all;

  return (
    <div className="flex flex-col gap-4">
      <div className="glass-card flex flex-col gap-2.5 rounded-xl px-4 py-3.5">
        <div className="relative">
          <Search
            size={13}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-secondary-500"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter results by name, headline or skill…"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-orange-500/50 dark:border-white/[0.07] dark:bg-white/[0.03] dark:text-secondary-300 dark:placeholder:text-secondary-600"
          />
        </div>
        <FilterRow
          label="AVAILABILITY"
          value={availability}
          options={AVAILABILITY_OPTIONS}
          labels={AVAILABILITY_LABEL}
          onChange={setAvailability}
        />
        <FilterRow
          label="EMPLOYMENT"
          value={employment}
          options={EMPLOYMENT_OPTIONS}
          labels={EMPLOYMENT_LABEL}
          onChange={setEmployment}
        />
        <FilterRow
          label="WORK TYPE"
          value={workType}
          options={WORK_TYPE_OPTIONS}
          labels={WORK_TYPE_LABEL}
          onChange={setWorkType}
        />
      </div>

      {isLoading ? (
        <div className="grid animate-pulse grid-cols-1 gap-3 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="glass-card h-36 rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <p className="m-0 py-12 text-center text-[12px] text-danger-600 dark:text-danger-400">
          Could not load profiles.
        </p>
      ) : profiles.length === 0 ? (
        <div className="glass-card flex flex-col items-center rounded-2xl px-10 py-16 text-center">
          <Briefcase size={24} className="mb-3 text-slate-300 dark:text-secondary-700" />
          <p className="m-0 text-[13px] font-semibold text-slate-500 dark:text-secondary-500">
            No testers found
          </p>
          <p className="m-0 mt-1 text-[11px] text-slate-400 dark:text-secondary-700">
            Try loosening the filters.
          </p>
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 gap-3 transition-opacity md:grid-cols-2 ${
            isFetching ? "opacity-70" : ""
          }`}
        >
          {profiles.map((p, i) => {
            const id = p.userId ?? p.id;
            return (
              <div
                role="button"
                tabIndex={0}
                key={id ?? i}
                onClick={() => id && setOpenUserId(id)}
                onKeyDown={(e) => e.key === "Enter" && id && setOpenUserId(id)}
                className="glass-card flex cursor-pointer flex-col gap-3 rounded-2xl p-4 text-left transition-colors hover:border-orange-500/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-info-500/30 bg-info-500/15 text-[11px] font-bold text-info-600 dark:text-info-400">
                    {getInitials(p.fullName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="m-0 truncate text-[13px] font-semibold text-slate-800 dark:text-slate-200">
                      {p.fullName ?? "Unnamed tester"}
                    </p>
                    <p className="m-0 flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-secondary-500">
                      <span className={`h-1.5 w-1.5 rounded-full ${getAvailabilityDot(p.availabilityStatus)}`} />
                      {getAvailabilityLabel(p.availabilityStatus)}
                    </p>
                  </div>
                </div>

                {p.headline && (
                  <p className="m-0 line-clamp-2 text-[12px] text-slate-600 dark:text-slate-300">
                    {p.headline}
                  </p>
                )}

                {p.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {p.skills.slice(0, 5).map((s: string) => (
                      <span
                        key={s}
                        className="rounded-full border border-orange-500/[0.15] bg-orange-500/[0.07] px-2 py-0.5 text-[9px] capitalize text-orange-600 dark:text-orange-400"
                      >
                        {s}
                      </span>
                    ))}
                    {p.skills.length > 5 && (
                      <span className="px-1 py-0.5 text-[9px] text-slate-400">
                        +{p.skills.length - 5}
                      </span>
                    )}
                  </div>
                )}

                <p className="m-0 flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-secondary-500">
                  <MapPin size={10} />
                  {[
                    WORK_TYPE_LABEL[p.workTypePreference as WorkTypePreference] ?? p.workTypePreference,
                    EMPLOYMENT_LABEL[p.employmentTypePreference as EmploymentTypePreference] ??
                      p.employmentTypePreference,
                    p.yearsOfExperience > 0 && `${p.yearsOfExperience} yrs`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>

                {id && id !== myId && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(dmHref({ userId: id, fullName: p.fullName, email: p.email }));
                    }}
                    className="flex w-fit cursor-pointer items-center gap-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-[10px] font-bold text-orange-600 dark:text-orange-400"
                  >
                    <MessageCircle size={11} /> Message
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {openUserId && <ProfileDetailModal userId={openUserId} onClose={() => setOpenUserId(null)} />}
    </div>
  );
};