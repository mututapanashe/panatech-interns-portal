import {
  Bars3Icon,
  ChevronRightIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import logo from "../../assets/logo.png";

function Sidebar({
  title,
  subtitle,
  mobileTitle,
  mobileSubtitle,
  items,
  activeItem,
  onSelect,
  isOpen,
  onOpen,
  onClose,
}) {
  const navContent = (
    <nav className="dashboard-ui grid content-start gap-1.5 lg:gap-2">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeItem === item.id;

        return (
            <button
            className={`group flex w-full cursor-pointer items-center gap-2.5 rounded-[18px] px-3.5 py-2.5 text-left text-[13px] font-medium transition lg:gap-3 lg:rounded-[22px] lg:px-4 lg:py-3.5 lg:text-sm ${
              isActive
                ? "bg-[linear-gradient(135deg,#f97316_0%,#2563eb_100%)] text-white shadow-[0_20px_48px_-24px_rgba(37,99,235,0.45)]"
                : "text-slate-700 hover:bg-white hover:text-slate-950 hover:shadow-[0_16px_36px_-28px_rgba(15,23,42,0.35)]"
            }`}
            key={item.id}
            onClick={() => onSelect(item.id)}
            type="button"
          >
            <Icon className="h-[18px] w-[18px] lg:h-5 lg:w-5" />
            <span className="min-w-0 flex-1">{item.label}</span>
            <ChevronRightIcon
              className={`h-3.5 w-3.5 transition lg:h-4 lg:w-4 ${
                isActive
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="dashboard-ui hidden w-72 flex-shrink-0 self-start rounded-[32px] border border-slate-200/80 bg-white/92 p-5 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.18)] lg:block">
        <div className="rounded-[24px] bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_45%,#eff6ff_100%)] p-4 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.25)]">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/92 shadow-[0_16px_36px_-24px_rgba(15,23,42,0.22)]">
            <img alt="panaTECH logo" className="h-7 w-auto object-contain" src={logo} />
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-600">
            {title}
          </p>
          <div className="mt-3 flex items-start gap-2.5">
            <UserCircleIcon className="mt-1 h-6 w-6 flex-shrink-0 text-slate-500" />
            <p className="min-w-0 break-words text-2xl leading-tight text-slate-950">{subtitle}</p>
          </div>
        </div>
        <div className="mt-6 rounded-[28px] bg-slate-50/80 p-3">{navContent}</div>
      </aside>

      <div className="lg:hidden">
        <div className="dashboard-ui fixed inset-x-0 top-0 z-50 border-b border-slate-800/70 bg-[linear-gradient(180deg,rgba(15,23,42,0.97)_0%,rgba(30,41,59,0.94)_100%)] shadow-[0_12px_28px_-20px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 pb-2 pt-[max(0.58rem,env(safe-area-inset-top))] sm:px-6">
            <div className="flex items-center gap-2.5 px-0.5 py-1">
              <button
                className="inline-flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-[0.95rem] border border-slate-600/80 bg-white/10 text-slate-100 shadow-[0_10px_24px_-22px_rgba(15,23,42,0.28)] transition duration-200 hover:-translate-y-0.5 hover:border-orange-300/70 hover:bg-white/14 hover:text-orange-200 active:scale-[0.96]"
                onClick={onOpen}
                type="button"
              >
                <Bars3Icon className="h-4.5 w-4.5" />
              </button>
              <div className="min-w-0 flex-1 px-1.5 py-0.5">
                <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-orange-300">
                  {mobileTitle}
                </p>

                <div className="mt-0.5 flex items-center gap-2">
                  <span className="inline-flex h-5.5 w-5.5 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-slate-200">
                    <UserCircleIcon className="h-3.5 w-3.5" />
                  </span>
                  <p className="min-w-0 break-words pr-1 text-[13px] leading-5 text-white">
                    {mobileSubtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[5.05rem] sm:h-[5.3rem]" />
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-[2px] lg:hidden" onClick={onClose}>
          <div
            className="dashboard-ui flex h-full w-[86%] max-w-[20rem] flex-col overflow-hidden rounded-r-[32px] border-r border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.28)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-[1.1rem] border border-white/80 bg-white/92 shadow-[0_16px_36px_-24px_rgba(15,23,42,0.22)]">
                <img alt="panaTECH logo" className="h-6 w-auto object-contain" src={logo} />
              </div>
              <button
                className="ml-3 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-orange-200 hover:text-orange-600"
                onClick={onClose}
                type="button"
              >
                <XMarkIcon className="h-4.5 w-4.5" />
              </button>
            </div>
            <div className="mt-3 min-w-0 rounded-[22px] bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_46%,#eff6ff_100%)] p-3 shadow-[0_16px_40px_-26px_rgba(15,23,42,0.22)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-600">
                {title}
              </p>
              <div className="mt-2.5 flex items-start gap-2.5">
                <UserCircleIcon className="mt-0.5 h-4.5 w-4.5 flex-shrink-0 text-slate-500" />
                <p className="min-w-0 break-words pr-2 text-[15px] leading-6 text-slate-950 sm:text-base">
                  {subtitle}
                </p>
              </div>
            </div>
            <div className="mt-4 flex-1 rounded-[24px] bg-white/90 p-2.5 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.18)]">
              {navContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
