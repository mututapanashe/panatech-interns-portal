import { cn } from "../../utils/cn";

const statusClasses = {
  accepted: "bg-emerald-50 text-emerald-700",
  rejected: "bg-rose-50 text-rose-700",
  "under review": "bg-sky-50 text-sky-700",
  submitted: "bg-orange-50 text-orange-700",
  "submitted externally": "bg-amber-50 text-amber-700",
  "applied - awaiting response": "bg-amber-50 text-amber-700",
  "portal apply": "bg-sky-50 text-sky-700",
  "email apply": "bg-violet-50 text-violet-700",
  "external apply": "bg-orange-50 text-orange-700",
  open: "bg-emerald-50 text-emerald-700",
  closed: "bg-slate-200 text-slate-700",
  default: "bg-slate-100 text-slate-700",
};

function StatusBadge({ children, className = "", status, tone }) {
  const normalized = String(tone || status || children || "")
    .trim()
    .toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex w-fit rounded-full border border-white/70 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] shadow-[0_10px_24px_-18px_rgba(15,23,42,0.28)]",
        statusClasses[normalized] || statusClasses.default,
        className,
      )}
    >
      {children || status}
    </span>
  );
}

export default StatusBadge;
