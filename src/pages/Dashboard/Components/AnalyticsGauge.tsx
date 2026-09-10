import { useMemo, useState, useRef, useEffect } from "react";

interface OverallProgressProps {
  total: number;
  completed: number;
  delayed: number;
  ongoing: number;
  onFilterChange?: (filter: string) => void;
}

const CX = 130;
const CY = 132;
const RADIUS = 100;
const STROKE_WIDTH = 14;
const TICK_COUNT = 50;

const SEGMENTS = [
  { min: 0, max: 25, color: "#239A3C" },  // success-500
  { min: 25, max: 50, color: "#ED6214" }, // orange-500
  { min: 50, max: 75, color: "#CB460E" }, // orange-600
  { min: 75, max: 100, color: "#3D3D3D" },
];

const LABEL_VALUES = [0, 25, 50, 100];

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "this-week", label: "This Week" },
  { value: "this-month", label: "This Month" },
  { value: "this-quarter", label: "This Quarter" },
  { value: "this-year", label: "This Year" },
];

function valueToAngle(value: number): number {
  return 180 - (value / 100) * 180;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy - r * Math.sin(angleRad) };
}

function describeArc(cx: number, cy: number, r: number, startValue: number, endValue: number): string {
  const startAngle = valueToAngle(startValue);
  const endAngle = valueToAngle(endValue);
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = startAngle - endAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

export default function OverallProgress({ total, completed, delayed, ongoing, onFilterChange }: OverallProgressProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const percentage = useMemo(() => {
    if (total <= 0) return 0;
    return Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
  }, [total, completed]);

  const filledArcs = useMemo(() => {
    const arcs: { d: string; color: string }[] = [];
    for (const seg of SEGMENTS) {
      if (seg.color === "#3D3D3D") continue;
      if (percentage <= seg.min) break;
      const end = Math.min(percentage, seg.max);
      arcs.push({ d: describeArc(CX, CY, RADIUS, seg.min, end), color: seg.color });
    }
    return arcs;
  }, [percentage]);

  const unfilledArc = useMemo(() => {
    if (percentage >= 100) return null;
    return describeArc(CX, CY, RADIUS, percentage, 100);
  }, [percentage]);

  const ticks = useMemo(() => {
    return Array.from({ length: TICK_COUNT + 1 }, (_, i) => {
      const value = (i / TICK_COUNT) * 100;
      const angle = valueToAngle(value);
      const isMajor = value % 25 === 0;
      const innerR = RADIUS + STROKE_WIDTH / 2 + 2;
      const outerR = innerR + (isMajor ? 10 : 5);
      const p1 = polarToCartesian(CX, CY, innerR, angle);
      const p2 = polarToCartesian(CX, CY, outerR, angle);
      return { p1, p2, isMajor };
    });
  }, []);

  const labels = useMemo(() => {
    return LABEL_VALUES.map((value) => {
      const angle = valueToAngle(value);
      const labelR = RADIUS + STROKE_WIDTH / 2 + 20;
      const pos = polarToCartesian(CX, CY, labelR, angle);
      let anchor: string = "middle";
      if (value === 0) anchor = "end";
      if (value === 100) anchor = "start";
      return { value, pos, anchor };
    });
  }, []);

  const stats = [
    { value: total, label: "Total projects", color: "text-slate-900 dark:text-white" },
    { value: completed, label: "Completed", color: "text-success-600 dark:text-success-400" },
    { value: delayed, label: "Delayed", color: "text-danger-600 dark:text-danger-400" },
    { value: ongoing, label: "Ongoing", color: "text-orange-600 dark:text-orange-400" },
  ];

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    setIsDropdownOpen(false);
    if (onFilterChange) onFilterChange(value);
  };

  const selectedOption = FILTER_OPTIONS.find((opt) => opt.value === selectedFilter);

  return (
    <div className="glass-card rounded-2xl p-6 w-full h-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Overall Progress</h2>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
          >
            {selectedOption?.label}
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`mt-0.5 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}>
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="glass-panel absolute right-0 mt-2 w-40 rounded-lg py-1 z-10 animate-in fade-in slide-in-from-top-2 duration-200">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange(option.value)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    selectedFilter === option.value
                      ? "bg-orange-500/10 text-orange-700 dark:text-orange-400 font-medium"
                      : "text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <svg viewBox="0 0 260 165" className="mx-auto w-full">
        {unfilledArc && (
          <path d={unfilledArc} fill="none" stroke="#D1D5DB" strokeWidth={STROKE_WIDTH} strokeLinecap="butt" className="dark:opacity-20" />
        )}

        {filledArcs.map((arc, i) => (
          <path key={i} d={arc.d} fill="none" stroke={arc.color} strokeWidth={STROKE_WIDTH} strokeLinecap="butt" />
        ))}

        {ticks.map((tick, i) => (
          <line key={i} x1={tick.p1.x} y1={tick.p1.y} x2={tick.p2.x} y2={tick.p2.y} stroke="#757575" strokeWidth={tick.isMajor ? 1.5 : 0.8} />
        ))}

        {labels.map((label) => (
          <text key={label.value} x={label.pos.x} y={label.pos.y} textAnchor={label.anchor} dominantBaseline="middle" fill="#757575" fontSize="11" fontWeight="500">
            {label.value}
          </text>
        ))}

        <text x={CX} y={CY - 32} textAnchor="middle" dominantBaseline="middle" fill="#ED6214" fontSize="36" fontWeight="700">
          {percentage}%
        </text>

        <text x={CX} y={CY - 4} textAnchor="middle" dominantBaseline="middle" fill="#757575" fontSize="13">
          Completed
        </text>
      </svg>

      <div className="mt-4 grid grid-cols-4 gap-4 border-t border-black/10 dark:border-white/10 pt-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}