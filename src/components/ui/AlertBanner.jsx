import { cn } from "../../utils/cn";

const toneClasses = {
  error: "border-rose-200 bg-rose-50 text-rose-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  info: "border-sky-200 bg-sky-50 text-sky-700",
};

function AlertBanner({ children, className = "", tone = "info" }) {
  return (
    <p
      className={cn(
        "rounded-[20px] border px-4 py-3 text-sm leading-7",
        toneClasses[tone] || toneClasses.info,
        className,
      )}
      role="status"
    >
      {children}
    </p>
  );
}

export default AlertBanner;
