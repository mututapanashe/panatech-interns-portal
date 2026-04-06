function StatsCard({ label, value, note, accent = "orange", badge = "01" }) {
  const accentClasses = {
    orange: "bg-orange-50 text-orange-600 ring-orange-100",
    blue: "bg-sky-50 text-sky-700 ring-sky-100",
    slate: "bg-slate-100 text-slate-800 ring-slate-200",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  };

  return (
    <article className="dashboard-surface relative overflow-hidden rounded-[24px] border border-slate-300/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(240,245,250,0.98)_100%)] p-4 shadow-[0_26px_74px_-42px_rgba(15,23,42,0.24)] ring-1 ring-slate-100/90 sm:rounded-[26px] sm:p-5 lg:rounded-[28px]">
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-1 ${
          accent === "blue"
            ? "bg-[linear-gradient(90deg,#0f172a_0%,#0284c7_100%)]"
            : accent === "emerald"
              ? "bg-[linear-gradient(90deg,#0f172a_0%,#10b981_100%)]"
              : accent === "slate"
                ? "bg-[linear-gradient(90deg,#0f172a_0%,#64748b_100%)]"
                : "bg-[linear-gradient(90deg,#0f172a_0%,#f97316_100%)]"
        }`}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="inline-flex rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500 shadow-sm">
            {label}
          </p>
          <p className="mt-3.5 text-[2rem] leading-none text-slate-950 sm:mt-4 sm:text-[2.2rem] lg:text-[2.35rem]">{value}</p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-[1rem] ring-1 shadow-[0_12px_30px_-22px_rgba(15,23,42,0.28)] sm:h-12 sm:w-12 sm:rounded-[1.05rem] ${accentClasses[accent] || accentClasses.orange}`}
        >
          <span className="text-[13px] font-semibold">{badge}</span>
        </div>
      </div>
      <div className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-slate-200/80">
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
      {note && <p className="mt-3.5 text-sm leading-6 text-slate-600 sm:mt-4 sm:leading-7">{note}</p>}
    </article>
  );
}

export default StatsCard;
