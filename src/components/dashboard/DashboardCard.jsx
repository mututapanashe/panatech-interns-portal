import SectionHeading from "../ui/SectionHeading";

function DashboardCard({ eyebrow, title, description, children, className = "" }) {
  return (
    <section
      className={`relative overflow-hidden rounded-[34px] border border-slate-200/90 bg-white/94 p-5 shadow-[0_30px_90px_-44px_rgba(15,23,42,0.22)] backdrop-blur-xl sm:p-6 ${className}`.trim()}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(249,115,22,0)_0%,rgba(249,115,22,0.55)_22%,rgba(37,99,235,0.55)_78%,rgba(37,99,235,0)_100%)]" />
      <div className="pointer-events-none absolute -right-16 top-[-4.5rem] h-36 w-36 rounded-full bg-sky-200/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-[-4rem] h-32 w-32 rounded-full bg-orange-200/20 blur-3xl" />
      {(eyebrow || title || description) && (
        <SectionHeading
          className="relative mb-7"
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
