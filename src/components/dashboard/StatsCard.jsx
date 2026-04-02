function StatsCard({ label, value, note, accent = "orange", badge = "01" }) {
  const accentClasses = {
    orange: "from-orange-100/95 via-orange-50 to-white text-orange-600 ring-orange-100",
    blue: "from-sky-100/95 via-sky-50 to-white text-sky-700 ring-sky-100",
    slate: "from-slate-200/90 via-slate-100 to-white text-slate-800 ring-slate-200",
    emerald: "from-emerald-100/95 via-emerald-50 to-white text-emerald-700 ring-emerald-100",
  };

  return (
    <article className="relative overflow-hidden rounded-[28px] border border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.98)_100%)] p-5 shadow-[0_26px_74px_-44px_rgba(15,23,42,0.22)] ring-1 ring-white/75">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(15,23,42,0)_0%,rgba(148,163,184,0.38)_50%,rgba(15,23,42,0)_100%)]" />
      <div className="pointer-events-none absolute right-[-1rem] top-[-1rem] h-24 w-24 rounded-full bg-slate-100/70 blur-2xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
            {label}
          </p>
          <p className="mt-3.5 text-3xl leading-none text-slate-950 sm:text-[2.4rem]">{value}</p>
        </div>
        <div
          className={`flex h-13 w-13 items-center justify-center rounded-[1.15rem] bg-gradient-to-br ring-1 ${accentClasses[accent] || accentClasses.orange}`}
        >
          <span className="text-[13px] font-semibold">{badge}</span>
        </div>
      </div>
      <div className="relative mt-4.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${accent === "blue"
            ? "from-sky-500 to-sky-300"
            : accent === "emerald"
              ? "from-emerald-500 to-emerald-300"
              : accent === "slate"
                ? "from-slate-700 to-slate-400"
                : "from-orange-500 to-amber-300"}`}
        />
      </div>
      {note && <p className="mt-3.5 text-sm leading-6 text-slate-600 sm:leading-7">{note}</p>}
    </article>
  );
}

export default StatsCard;
