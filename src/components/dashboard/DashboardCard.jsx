import SectionHeading from "../ui/SectionHeading";

function DashboardCard({ eyebrow, title, description, children, className = "" }) {
  return (
    <section
      className={`dashboard-surface relative overflow-hidden rounded-[32px] border border-slate-300/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(239,244,249,0.98)_100%)] p-5 shadow-[0_28px_82px_-44px_rgba(15,23,42,0.26)] ring-1 ring-slate-100/90 backdrop-blur-sm sm:p-6 lg:p-7 ${className}`.trim()}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#0f172a_0%,#334155_42%,#f97316_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(15,23,42,0.06)_0%,rgba(15,23,42,0)_100%)]" />
      <div className="pointer-events-none absolute right-[-3rem] top-[-3rem] h-24 w-24 rounded-full bg-slate-200/50 blur-3xl" />
      {(eyebrow || title || description) && (
        <SectionHeading
          className="relative mb-6 sm:mb-7"
          description={description}
          eyebrow={eyebrow}
          title={title}
        />
      )}
      <div className="relative">{children}</div>
    </section>
  );
}

export default DashboardCard;
