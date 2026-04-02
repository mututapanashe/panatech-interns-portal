import { cn } from "../../utils/cn";

function SectionHeading({
  className = "",
  description,
  eyebrow,
  title,
  titleClassName = "",
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-[0.26em] text-orange-500">
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className={cn("text-2xl leading-tight text-slate-950 sm:text-3xl", titleClassName)}>
          {title}
        </h2>
      )}
      {description && (
        <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
