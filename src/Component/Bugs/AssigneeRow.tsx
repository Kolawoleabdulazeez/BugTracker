import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Loader2, Search } from "lucide-react";
import { AnchoredPopover } from "@/Component/TestCase/AnchoredPopover";

export interface AssigneeOption {
  id: string;
  name: string;
  email?: string;
}

interface Person {
  userId?: string;
  fullName?: string;
  email?: string;
}

interface AssigneeRowProps {
  role: "Tester" | "Developer";
  person?: Person | null;
  options: AssigneeOption[];
  loading?: boolean;
  saving?: boolean;
  disabled?: boolean;
  accent: string; // avatar background class, e.g. "bg-info-500"
  onSelect: (id: string) => Promise<unknown> | void;
}

const initials = (name?: string) =>
  (name ?? "?")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const AssigneeRow = ({
  role,
  person,
  options,
  loading,
  saving,
  disabled,
  accent,
  onSelect,
}: AssigneeRowProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const btnRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    setQuery("");
    setActive(0);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) => o.name.toLowerCase().includes(q) || o.email?.toLowerCase().includes(q)
    );
  }, [options, query]);

  useEffect(() => setActive(0), [query]);

  const choose = async (o: AssigneeOption) => {
    if (o.id === person?.userId || saving) return;
    try {
      await onSelect(o.id);
      close();
    } catch {
      /* the mutation hook already shows the error toast; keep the list open */
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[active]) {
      e.preventDefault();
      choose(filtered[active]);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
            person ? accent : "bg-slate-300 dark:bg-white/10"
          }`}
        >
          {person ? initials(person.fullName) : "?"}
        </div>
        <div className="min-w-0">
          <p className="m-0 truncate text-sm font-semibold text-slate-800 dark:text-white">
            {person?.fullName ?? `No ${role.toLowerCase()} assigned`}
          </p>
          <p className="m-0 truncate text-xs text-slate-400 dark:text-secondary-500">
            {role}
            {person?.email ? ` · ${person.email}` : ""}
          </p>
        </div>
      </div>

      <button
        ref={btnRef}
        type="button"
        disabled={disabled || saving}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          open
            ? "border-orange-500/50 bg-orange-500/10 text-orange-600 dark:text-orange-400"
            : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
        }`}
      >
        {saving ? (
          <>
            <Loader2 size={12} className="animate-spin" /> Saving
          </>
        ) : (
          <>
            {person ? "Change" : "Assign"}
            <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </>
        )}
      </button>

      <AnchoredPopover anchorRef={btnRef} open={open} onClose={close} align="end">
        <div className="w-[300px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/[0.1] dark:bg-secondary-900">
          <div className="border-b border-slate-100 p-2.5 dark:border-white/[0.06]">
            <p className="m-0 mb-2 px-1 text-[9px] font-bold tracking-[0.1em] text-slate-400 dark:text-secondary-500">
              ASSIGN {role.toUpperCase()}
            </p>
            <div className="relative">
              <Search
                size={13}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-secondary-500"
              />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search by name or email"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-orange-500/50 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-200 dark:placeholder:text-[#475569]"
              />
            </div>
          </div>

          <div role="listbox" className="max-h-[240px] overflow-y-auto p-1.5">
            {loading ? (
              <p className="m-0 px-3 py-6 text-center text-xs text-slate-400 dark:text-secondary-500">
                Loading members…
              </p>
            ) : filtered.length === 0 ? (
              <p className="m-0 px-3 py-6 text-center text-xs text-slate-400 dark:text-secondary-500">
                {options.length === 0
                  ? `No ${role.toLowerCase()}s in this project`
                  : "No matches"}
              </p>
            ) : (
              filtered.map((o, i) => {
                const isCurrent = o.id === person?.userId;
                return (
                  <button
                    key={o.id}
                    type="button"
                    role="option"
                    aria-selected={isCurrent}
                    disabled={isCurrent}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => choose(o)}
                    className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg border-none px-2.5 py-2 text-left transition-colors disabled:cursor-default ${
                      i === active && !isCurrent
                        ? "bg-orange-500/[0.08]"
                        : "bg-transparent"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${accent}`}
                    >
                      {initials(o.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {o.name}
                      </span>
                      {o.email && (
                        <span className="block truncate text-[10px] text-slate-400 dark:text-secondary-500">
                          {o.email}
                        </span>
                      )}
                    </span>
                    {isCurrent && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-orange-600 dark:text-orange-400">
                        <Check size={12} /> Current
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </AnchoredPopover>
    </div>
  );
};