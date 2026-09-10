import { PRIORITY_CONFIG } from "@/utils";
import { Priority } from "@/utils/types";

export const PriBadge = ({ priority }: { priority: Priority }) => {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <span className={`px-[7px] py-0.5 rounded-[3px] border text-[9px] font-bold tracking-widest ${cfg.border} ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
};