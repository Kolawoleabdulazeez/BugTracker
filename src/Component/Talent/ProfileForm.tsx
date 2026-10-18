"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, X } from "lucide-react";
import {
  useDeleteMyProfile,
  useGetMyProfile,
  useUpsertProfile,
} from "@/services/profile/useProfile";
import { PortfolioItem, Profile, UpsertProfileParam } from "@/services/profile/profile.api";
import {
  AVAILABILITY_LABEL,
  AVAILABILITY_OPTIONS,
  AvailabilityStatus,
  EMPLOYMENT_OPTIONS,
  EmploymentTypePreference,
  parseDuration,
  WORK_TYPE_OPTIONS,
  WorkTypePreference,
} from "@/utils";
import { PortfolioSection } from "./PortfolioSection";

const inputCls =
  "w-full rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] px-3.5 py-2.5 text-[13px] text-slate-800 dark:text-[#e2e8f0] outline-none placeholder:text-slate-400 dark:placeholder:text-[#334155] focus:border-orange-500/50 transition-colors disabled:opacity-50";
const labelCls =
  "mb-1.5 block text-[9px] font-bold tracking-[0.1em] text-slate-400 dark:text-[#334155]";

interface FormState {
  headline: string;
  bio: string;
  yearsOfExperience: string;
  skills: string[];
  availabilityStatus: AvailabilityStatus;
  employmentTypePreference: EmploymentTypePreference;
  workTypePreference: WorkTypePreference;
  rateOrSalaryExpectation: string;
  gitHub: string;
  linkedIn: string;
  portfolio: string;
  twitter: string;
  isPublic: boolean;
}

const emptyForm: FormState = {
  headline: "",
  bio: "",
  yearsOfExperience: "",
  skills: [],
  availabilityStatus: "open",
  employmentTypePreference: "both",
  workTypePreference: "remote",
  rateOrSalaryExpectation: "",
  gitHub: "",
  linkedIn: "",
  portfolio: "",
  twitter: "",
  isPublic: true,
};

const fromProfile = (p: Profile): FormState => ({
  headline: p.headline ?? "",
  bio: p.bio ?? "",
  yearsOfExperience: p.yearsOfExperience != null ? String(p.yearsOfExperience) : "",
  skills: p.skills ?? [],
  availabilityStatus: p.availabilityStatus ?? "open",
  employmentTypePreference: p.employmentTypePreference ?? "both",
  workTypePreference: p.workTypePreference ?? "remote",
  rateOrSalaryExpectation: p.rateOrSalaryExpectation ?? "",
  gitHub: p.socialLinks?.gitHub ?? "",
  linkedIn: p.socialLinks?.linkedIn ?? "",
  portfolio: p.socialLinks?.portfolio ?? "",
  twitter: p.socialLinks?.twitter ?? "",
  isPublic: p.isPublic ?? true,
});

// Experience is not edited in this form. It is rebuilt from the saved items
// so a PUT never wipes them.
const toPayload = (
  f: FormState,
  items: PortfolioItem[] = []
): UpsertProfileParam => ({
  headline: f.headline.trim(),
  bio: f.bio.trim(),
  yearsOfExperience: Number(f.yearsOfExperience) || 0,
  skills: f.skills,
  availabilityStatus: f.availabilityStatus,
  employmentTypePreference: f.employmentTypePreference,
  workTypePreference: f.workTypePreference,
  rateOrSalaryExpectation: f.rateOrSalaryExpectation.trim(),
  socialLinks: {
    gitHub: f.gitHub.trim(),
    linkedIn: f.linkedIn.trim(),
    portfolio: f.portfolio.trim(),
    twitter: f.twitter.trim(),
  },
  isPublic: f.isPublic,
  experience: items
    .filter((e) => parseDuration(e.duration).start !== "")
    .map((e) => {
      const d = parseDuration(e.duration);
      return {
        projectName: e.projectName,
        role: e.role,
        description: e.description,
        link: e.link,
        startDate: new Date(d.start).toISOString(),
        endDate: d.current || !d.end ? null : new Date(d.end).toISOString(),
      };
    }),
});

function Segmented<T extends string>({
  value,
  options,
  onChange,
  labels,
}: {
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
  labels?: Partial<Record<T, string>>;
}) {
  return (
    <div className="flex gap-1.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`flex-1 cursor-pointer rounded-lg border py-2 text-[10px] font-bold capitalize transition-all duration-[120ms] ${
            value === o
              ? "border-orange-500/40 bg-orange-500/10 text-orange-600 dark:text-orange-400"
              : "border-slate-200 bg-slate-50 text-slate-400 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-[#475569]"
          }`}
        >
          {labels?.[o] ?? o}
        </button>
      ))}
    </div>
  );
}

function SkillsInput({
  skills,
  onChange,
}: {
  skills: string[];
  onChange: (s: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim().replace(/,$/, "");
    if (v && !skills.some((s) => s.toLowerCase() === v.toLowerCase())) {
      onChange([...skills, v]);
    }
    setDraft("");
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {skills.map((s) => (
          <span
            key={s}
            className="flex items-center gap-1 rounded-full border border-orange-500/[0.15] bg-orange-500/[0.07] px-2.5 py-1 text-[11px] capitalize text-orange-600 dark:text-orange-400"
          >
            {s}
            <button
              type="button"
              onClick={() => onChange(skills.filter((x) => x !== s))}
              className="cursor-pointer border-none bg-transparent p-0 text-orange-500"
              aria-label={`Remove ${s}`}
            >
              <X size={11} />
            </button>
          </span>
        ))}
      </div>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
        placeholder="Type a skill and press Enter, e.g. Cypress"
        className={inputCls}
      />
    </div>
  );
}

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="glass-card flex flex-col gap-4 rounded-2xl p-5">
    <p className="m-0 text-[10px] font-bold tracking-[0.12em] text-slate-500 dark:text-secondary-500">
      {title}
    </p>
    {children}
  </div>
);

export const ProfileForm = () => {
  const { data: profile, isLoading, isError } = useGetMyProfile();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const { mutate: save, isPending: saving } = useUpsertProfile();
  const { mutate: remove, isPending: deleting } = useDeleteMyProfile(() =>
    setForm(emptyForm)
  );

  useEffect(() => {
    if (profile) setForm(fromProfile(profile));
  }, [profile]);

  useEffect(() => {
    if (!confirmingDelete) return;
    const t = setTimeout(() => setConfirmingDelete(false), 3000);
    return () => clearTimeout(t);
  }, [confirmingDelete]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const canSave = form.headline.trim().length > 0 && !saving && !deleting;
  const hasProfile = !!profile && !isError;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        {[0, 1, 2].map((i) => (
          <div key={i} className="glass-card h-40 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[760px] flex-col gap-4">
      <div
        className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
          form.isPublic
            ? "border-emerald-500/25 bg-emerald-500/[0.06]"
            : "border-slate-200 bg-slate-50 dark:border-white/[0.07] dark:bg-white/[0.02]"
        }`}
      >
        <div className="min-w-0">
          <p className="m-0 text-[12px] font-semibold text-slate-800 dark:text-slate-200">
            {form.isPublic ? "Visible to project owners" : "Hidden from project owners"}
          </p>
          <p className="m-0 mt-0.5 text-[11px] text-slate-500 dark:text-secondary-500">
            {hasProfile
              ? "Only public profiles appear in Browse."
              : "You have no profile yet. Fill this in and save to create one."}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={form.isPublic}
          onClick={() => set("isPublic", !form.isPublic)}
          className={`relative h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-none transition-colors ${
            form.isPublic ? "bg-emerald-500" : "bg-slate-300 dark:bg-white/[0.12]"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
              form.isPublic ? "left-[22px]" : "left-0.5"
            }`}
          />
        </button>
      </div>

      <fieldset disabled={saving || deleting} className="m-0 flex flex-col gap-4 border-0 p-0">
        <Card title="ABOUT">
          <div>
            <label className={labelCls}>HEADLINE *</label>
            <input
              value={form.headline}
              onChange={(e) => set("headline", e.target.value)}
              placeholder="e.g. QA engineer focused on web and API testing"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>BIO</label>
            <textarea
              rows={4}
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
              placeholder="What do you test, and how do you work?"
              className={`${inputCls} resize-none`}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls}>YEARS OF EXPERIENCE</label>
              <input
                type="number"
                min={0}
                value={form.yearsOfExperience}
                onChange={(e) => set("yearsOfExperience", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>RATE OR SALARY EXPECTATION</label>
              <input
                value={form.rateOrSalaryExpectation}
                onChange={(e) => set("rateOrSalaryExpectation", e.target.value)}
                placeholder="e.g. $25/hr"
                className={inputCls}
              />
            </div>
          </div>
        </Card>

        <Card title="SKILLS">
          <SkillsInput skills={form.skills} onChange={(s) => set("skills", s)} />
        </Card>

        <Card title="AVAILABILITY">
          <div>
            <label className={labelCls}>STATUS</label>
            <Segmented
              value={form.availabilityStatus}
              options={AVAILABILITY_OPTIONS}
              labels={AVAILABILITY_LABEL}
              onChange={(v) => set("availabilityStatus", v)}
            />
          </div>
          <div>
            <label className={labelCls}>EMPLOYMENT TYPE</label>
            <Segmented
              value={form.employmentTypePreference}
              options={EMPLOYMENT_OPTIONS}
              onChange={(v) => set("employmentTypePreference", v)}
            />
          </div>
          <div>
            <label className={labelCls}>WORK TYPE</label>
            <Segmented
              value={form.workTypePreference}
              options={WORK_TYPE_OPTIONS}
              onChange={(v) => set("workTypePreference", v)}
            />
          </div>
        </Card>

        <Card title="LINKS">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(
              [
                ["gitHub", "GITHUB", "https://github.com/you"],
                ["linkedIn", "LINKEDIN", "https://linkedin.com/in/you"],
                ["portfolio", "PORTFOLIO", "https://yoursite.com"],
                ["twitter", "TWITTER", "https://twitter.com/you"],
              ] as const
            ).map(([key, label, ph]) => (
              <div key={key}>
                <label className={labelCls}>{label}</label>
                <input
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  placeholder={ph}
                  className={inputCls}
                />
              </div>
            ))}
          </div>
        </Card>
      </fieldset>

      <PortfolioSection items={profile?.portfolioItems ?? []} canEdit={hasProfile} />

      <div className="flex gap-2 pb-6">
        {hasProfile &&
          (confirmingDelete ? (
            <button
              type="button"
              onClick={() => {
                setConfirmingDelete(false);
                remove();
              }}
              className="flex cursor-pointer items-center gap-1.5 rounded-[10px] border border-danger-600 bg-danger-600 px-4 py-3 text-xs font-bold text-white"
            >
              <Trash2 size={13} /> Confirm delete?
            </button>
          ) : (
            <button
              type="button"
              disabled={deleting || saving}
              onClick={() => setConfirmingDelete(true)}
              className="flex cursor-pointer items-center gap-1.5 rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-danger-600 disabled:opacity-50 dark:border-white/[0.07] dark:bg-white/[0.02] dark:text-danger-400"
            >
              <Trash2 size={13} /> Delete profile
            </button>
          ))}

        <button
          type="button"
          onClick={() => canSave && save(toPayload(form, profile?.portfolioItems))}
          disabled={!canSave}
          className={`flex flex-1 items-center justify-center gap-2 rounded-[10px] border py-3 text-[13px] font-bold transition-all duration-150 ${
            canSave
              ? "cursor-pointer border-orange-500/40 bg-orange-500 text-white hover:bg-orange-600"
              : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300 dark:border-white/[0.04] dark:bg-white/[0.01] dark:text-[#1e293b]"
          }`}
        >
          {saving ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Saving…
            </>
          ) : hasProfile ? (
            "Save changes"
          ) : (
            "Create profile"
          )}
        </button>
      </div>
    </div>
  );
};