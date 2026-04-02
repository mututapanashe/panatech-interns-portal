import { cn } from "../../utils/cn";

const variantClasses = {
  primary:
    "bg-orange-500 text-white shadow-[0_18px_40px_-18px_rgba(249,115,22,0.8)] hover:bg-orange-600 focus-visible:ring-orange-200",
  secondary:
    "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 focus-visible:ring-slate-200",
  surface:
    "border border-slate-200 bg-white text-slate-800 shadow-sm hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-200",
  dark:
    "bg-slate-950 text-white hover:bg-slate-800 focus-visible:ring-slate-300",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-orange-600 focus-visible:ring-slate-200",
};

const sizeClasses = {
  sm: "px-4 py-2.5 text-sm",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-3.5 text-sm",
};

function Button({
  children,
  className = "",
  disabled = false,
  fullWidth = false,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60",
        sizeClasses[size] || sizeClasses.md,
        variantClasses[variant] || variantClasses.primary,
        fullWidth && "w-full",
        className,
      )}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
