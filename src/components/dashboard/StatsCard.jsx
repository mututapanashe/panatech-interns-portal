function StatsCard({ label, value, note, accent = "orange", badge = "01" }) {
  const accentClasses = {
    orange: "from-orange-100/95 via-orange-50 to-white text-orange-600 ring-orange-100",
    blue: "from-sky-100/95 via-sky-50 to-white text-sky-700 ring-sky-100",
    slate: "from-slate-200/90 via-slate-100 to-white text-slate-800 ring-slate-200",
    emerald: "from-emerald-100/95 via-emerald-50 to-white text-emerald-700 ring-emerald-100",
  };

  return (
    <article className="relative overflow-hidden rounded-[30px] border border-slate-200/90 bg-white/95 p-5 shadow-[0_28px_80px_-44px_rgba(15,23,42,0.24)]">
      <div className="pointer-events-none absolute right-[-1rem] top-[-1rem] h-24 w-24 rounded-full bg-slate-100/70 blur-2xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
            {label}
          </p>
          <p className="mt-4 text-3xl leading-none text-slate-950 sm:text-[2.5rem]">{value}</p>
        </div>
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-gradient-to-br ring-1 ${accentClasses[accent] || accentClasses.orange}`}
        >
          <span className="text-sm font-semibold">{badge}</span>
        </div>
      </div>
      <div className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
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
      {note && <p className="mt-4 text-sm leading-6 text-slate-600 sm:leading-7">{note}</p>}
    </article>
  );
}

export default StatsCard;
