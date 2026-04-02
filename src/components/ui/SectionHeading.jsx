import { cn } from "../../utils/cn";

function SectionHeading({
  className = "",
  description,
  eyebrow,
  title,
  titleClassName = "",
}) {
  return (
    <div className={cn("space-y-2.5", className)}>
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-500">
          {eyebrow}
        </p>
      )}
      {title && (
        <h2
          className={cn(
            "text-[1.65rem] leading-tight text-slate-950 sm:text-[1.95rem]",
            titleClassName,
          )}
        >
          {title}
        </h2>
      )}
      {description && (
        <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-[15px] sm:leading-8">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
