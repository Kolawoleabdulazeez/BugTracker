import { getLifecycleConfig } from "@/utils";



export const Chip = ({ status }: { status: string }) => {
  const cfg = getLifecycleConfig(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-bold tracking-[0.08em] uppercase ${cfg.chip}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};