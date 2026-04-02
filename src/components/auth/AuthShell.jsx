import { createElement } from "react";
import { cn } from "../../utils/cn";

const shellTones = {
  dark: {
    aside:
      "bg-[linear-gradient(155deg,#0f172a_0%,#1d4ed8_54%,#f97316_100%)] text-white",
    brandText: "text-orange-200",
    description: "text-slate-100",
    headline: "text-white",
    pointCard: "border border-white/10 bg-white/10 backdrop-blur",
    pointText: "text-slate-100",
    imageWrap: "border border-white/10 bg-white/10",
    orbOne: "bg-orange-300/20",
    orbTwo: "bg-sky-300/20",
  },
  light: {
    aside: "bg-[linear-gradient(160deg,#fff7ed_0%,#ffffff_34%,#eff6ff_100%)] text-slate-950",
    brandText: "text-orange-500",
    description: "text-slate-600",
    headline: "text-slate-950",
    pointCard: "border border-slate-200 bg-white/80 shadow-sm",
    pointText: "text-slate-700",
    imageWrap: "border border-slate-200 bg-white shadow-sm",
    orbOne: "bg-orange-300/25",
    orbTwo: "bg-sky-300/25",
  },
};

function AuthShell({
  PointIcon,
  brandEyebrow,
  brandTitle,
  children,
  contentWidthClassName = "max-w-xl",
  description,
  headline,
  imageAlt,
  imageSrc,
  points,
  tone = "dark",
}) {
  const palette = shellTones[tone] || shellTones.dark;

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.14),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(37,99,235,0.14),_transparent_28%),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-4 pb-20 pt-8 sm:px-6 md:pb-28 md:pt-10">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/60 to-transparent" />
      <div className="absolute left-0 top-32 h-56 w-56 rounded-full bg-orange-200/30 blur-3xl" />
      <div className="absolute bottom-8 right-0 h-64 w-64 rounded-full bg-sky-200/35 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-[82rem] overflow-hidden rounded-[38px] border border-slate-200/80 bg-white/95 shadow-[0_30px_90px_-32px_rgba(15,23,42,0.28)] backdrop-blur lg:grid-cols-[0.95fr_1.05fr]">
        <aside className={cn("relative hidden overflow-hidden p-12 lg:block xl:p-14", palette.aside)}>
          <div className={cn("absolute -left-14 top-16 h-40 w-40 rounded-full blur-3xl", palette.orbOne)} />
          <div className={cn("absolute bottom-10 right-0 h-48 w-48 rounded-full blur-3xl", palette.orbTwo)} />

          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div>
                <p className="font-display text-2xl">{brandTitle}</p>
                <p className={cn("text-xs uppercase tracking-[0.28em]", palette.brandText)}>
                  {brandEyebrow}
                </p>
              </div>

              <h1 className={cn("mt-10 text-5xl leading-tight", palette.headline)}>{headline}</h1>
              <p className={cn("mt-6 max-w-lg text-base leading-8", palette.description)}>{description}</p>
            </div>

            <div className="space-y-4">
              {points.map((item) => (
                <div className={cn("flex items-start gap-3 rounded-[24px] px-4 py-4", palette.pointCard)} key={item}>
                  {createElement(PointIcon, {
                    className: cn("mt-1 h-5 w-5 flex-shrink-0", palette.brandText),
                  })}
                  <p className={cn("text-sm leading-7", palette.pointText)}>{item}</p>
                </div>
              ))}

              <div className={cn("overflow-hidden rounded-[28px]", palette.imageWrap)}>
                <img alt={imageAlt} className="h-56 w-full object-cover" src={imageSrc} />
              </div>
            </div>
          </div>
        </aside>

        <div className="flex h-full items-center p-6 sm:p-10 lg:p-12">
          <div className={cn("mx-auto w-full lg:py-4", contentWidthClassName)}>{children}</div>
        </div>
      </div>
    </section>
  );
}

export default AuthShell;
