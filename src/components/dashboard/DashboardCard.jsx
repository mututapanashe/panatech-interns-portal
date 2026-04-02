import SectionHeading from "../ui/SectionHeading";

function DashboardCard({ eyebrow, title, description, children, className = "" }) {
  return (
    <section
      className={`relative overflow-hidden rounded-[32px] border border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(248,250,252,0.97)_100%)] p-5 shadow-[0_28px_80px_-46px_rgba(15,23,42,0.2)] ring-1 ring-white/70 backdrop-blur-xl sm:p-6 lg:p-7 ${className}`.trim()}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(249,115,22,0)_0%,rgba(249,115,22,0.42)_28%,rgba(37,99,235,0.4)_72%,rgba(37,99,235,0)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(248,250,252,0.72)_0%,rgba(248,250,252,0)_100%)]" />
      <div className="pointer-events-none absolute -right-12 top-[-4rem] h-28 w-28 rounded-full bg-sky-100/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-[-4rem] h-28 w-28 rounded-full bg-orange-100/20 blur-3xl" />
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
