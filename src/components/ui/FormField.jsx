import { cn } from "../../utils/cn";

function FormField({
  children,
  className = "",
  error = "",
  hint = "",
  htmlFor,
  label,
  labelClassName = "",
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label
          className={cn("text-sm font-semibold text-slate-700", labelClassName)}
          htmlFor={htmlFor}
        >
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs leading-6 text-slate-500">{hint}</p>}
      {error && <p className="text-xs leading-6 text-rose-600">{error}</p>}
    </div>
  );
}

export default FormField;
