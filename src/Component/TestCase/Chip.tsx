import { TestStatus } from "@/utils/types";
import { STATUS_CONFIG } from "@/utils";

const FALLBACK_CONFIG = {
  label: "UNKNOWN",
  barHex: "#757575",
  chipBorder: "border-secondary-400/20",
  chipBg: "bg-secondary-400/[0.07]",
  chipText: "text-secondary-500 dark:text-secondary-400",
  glyph: "?",
};

export const Chip = ({ status }: { status: TestStatus }) => {
  const cfg = STATUS_CONFIG[status] ?? FALLBACK_CONFIG;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold tracking-widest ${cfg.chipBorder} ${cfg.chipBg} ${cfg.chipText}`}>
      <span className="text-[11px]">{cfg.glyph}</span>
      {cfg.label}
    </span>
  );
};