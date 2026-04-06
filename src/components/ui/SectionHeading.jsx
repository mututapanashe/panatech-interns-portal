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
        <p className="inline-flex items-center gap-2 rounded-full border border-slate-300/90 bg-slate-950 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-100 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.45)]">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
          {eyebrow}
        </p>
      )}
      {title && (
        <h2
          className={cn(
            "text-[1.55rem] leading-tight text-slate-950 sm:text-[1.8rem] lg:text-[2.05rem]",
            titleClassName,
          )}
        >
          {title}
        </h2>
      )}
      {description && (
        <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-[15px] sm:leading-7 lg:leading-8">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
