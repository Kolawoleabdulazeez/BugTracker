"use client";
import { setActiveSection } from "@/pages/features/Sectionslice";
import { RootState } from "@/pages/store";
import { DATA, PassFail, Severity, Status } from "@/pages/utils/data";
import { useSelector, useDispatch } from "react-redux";




// ─── Helpers ─────────────────────────────────────────────────────────────────
const severityStyle: Record<Severity, string> = {
  Critical: "bg-red-100 text-red-700 border border-red-200",
  High:     "bg-orange-100 text-orange-700 border border-orange-200",
  Medium:   "bg-yellow-100 text-yellow-700 border border-yellow-200",
  Low:      "bg-gray-100 text-gray-600 border border-gray-200",
};
const statusStyle: Record<Status, string> = {
  "Open":        "bg-red-50 text-red-600",
  "In Progress": "bg-blue-50 text-blue-600",
  "Resolved":    "bg-green-50 text-green-600",
  "Closed":      "bg-gray-100 text-gray-500",
};
const resultStyle: Record<PassFail, string> = {
  Pass:    "bg-emerald-100 text-emerald-700",
  Fail:    "bg-red-100 text-red-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Blocked: "bg-purple-100 text-purple-700",
};
const resultDot: Record<PassFail, string> = {
  Pass: "bg-emerald-500", Fail: "bg-red-500", Pending: "bg-yellow-400", Blocked: "bg-purple-500",
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function SectionPanel() {
  const dispatch      = useDispatch();
  const activeSection = useSelector((state: RootState) => state.section.activeSection);

  if (!activeSection || !DATA[activeSection]) return null;

  const d = DATA[activeSection];
  const passCount    = d.tests.filter(t => t.result === "Pass").length;
  const failCount    = d.tests.filter(t => t.result === "Fail").length;
  const pendingCount = d.tests.filter(t => t.result === "Pending" || t.result === "Blocked").length;
  const total        = d.tests.length;

  return (
    <div
      className="w-full min-h-screen animate-fadeIn"
      style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8fafc" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@500&display=swap');
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        .animate-fadeIn { animation: fadeIn 0.35s ease both; }
        @keyframes barGrow { from { width:0 } }
        .bar-anim { animation: barGrow 0.8s ease both; }
      `}</style>

      {/* ── Header banner ── */}
      <div
        className="relative overflow-hidden px-8 pt-8 pb-6"
        style={{ background: `linear-gradient(135deg, #0f172a 0%, #1e293b 60%, ${d.accent}22 100%)` }}
      >
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ background: d.accent }} />

        <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{d.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">{d.title}</h1>
              <p className="text-slate-400 text-sm mt-1 max-w-md">{d.description}</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(setActiveSection(null))}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
          >
            ← Back to Tracker
          </button>
        </div>

        {/* Stats row */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {d.stats.map(({ label, value, delta }) => (
            <div key={label} className="rounded-xl px-4 py-3"
              style={{ background: "rgba(255,255,255,0.07)", border: `1px solid ${d.accent}40` }}>
              <p className="text-slate-400 text-xs uppercase tracking-wider">{label}</p>
              <p className="text-2xl font-bold text-white mt-1"
                style={{ fontFamily: "'DM Mono', monospace" }}>{value}</p>
              {delta && <p className="text-xs mt-1" style={{ color: d.accent }}>{delta}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Bug list (2/3 width on xl) ── */}
        <div className="xl:col-span-2 space-y-6">

          {/* Recent Bugs */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Recent Bug Reports</h2>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-50 text-red-600">
                {d.bugs.filter(b => b.status === "Open" || b.status === "In Progress").length} Active
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {d.bugs.map((bug) => (
                <div key={bug.id} className="px-6 py-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    <span className="text-xs font-mono font-bold text-gray-400">{bug.id}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{bug.title}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityStyle[bug.severity]}`}>
                        {bug.severity}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle[bug.status]}`}>
                        {bug.status}
                      </span>
                      <span className="text-xs text-gray-400">by {bug.reporter} · {bug.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Test Cases */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Test Case Results</h2>
              {/* Mini pass/fail bar */}
              <div className="flex items-center gap-2">
                <div className="flex h-2 w-28 rounded-full overflow-hidden gap-px">
                  <div className="bg-emerald-400 bar-anim" style={{ width: `${(passCount / total) * 100}%` }} />
                  <div className="bg-red-400 bar-anim" style={{ width: `${(failCount / total) * 100}%`, animationDelay: "0.1s" }} />
                  <div className="bg-yellow-300 bar-anim" style={{ width: `${(pendingCount / total) * 100}%`, animationDelay: "0.2s" }} />
                </div>
                <span className="text-xs text-gray-400">{passCount}/{total} pass</span>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {d.tests.map((tc) => (
                <div key={tc.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${resultDot[tc.result]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{tc.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {tc.assignee} · {tc.duration}
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${resultStyle[tc.result]}`}>
                    {tc.result}
                  </span>
                  <span className="text-xs font-mono text-gray-300 flex-shrink-0 hidden sm:block">{tc.id}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Sidebar: team + chart ── */}
        <div className="space-y-6">

          {/* Test health donut-style summary */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Test Health</h2>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#34d399" strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - passCount / total)}`}
                    strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }}
                  />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f87171" strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - (passCount + failCount) / total)}`}
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'DM Mono', monospace" }}>
                    {Math.round((passCount / total) * 100)}%
                  </span>
                  <span className="text-xs text-gray-400">passing</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: "Passing", count: passCount,    color: "bg-emerald-400" },
                { label: "Failing", count: failCount,    color: "bg-red-400"     },
                { label: "Pending", count: pendingCount, color: "bg-yellow-300"  },
              ].map(({ label, count, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${color}`} />
                  <span className="text-sm text-gray-600 flex-1">{label}</span>
                  <span className="text-sm font-semibold text-gray-800" style={{ fontFamily: "'DM Mono', monospace" }}>
                    {count}
                  </span>
                  <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full ${color} bar-anim`} style={{ width: `${(count / total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Team Members */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Team Members</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {d.members.map((m) => (
                <div key={m.name} className="px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                  {/* Avatar */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: d.accent }}
                  >
                    {m.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.role}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-mono text-gray-800">{m.bugs} bugs</p>
                    <p className="text-xs text-emerald-500">{m.resolved} fixed</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}