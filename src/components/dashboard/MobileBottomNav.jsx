import { BriefcaseIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function SearchDiscoveryIcon({ className = "" }) {
  return (
    <span className={`relative inline-flex items-center justify-center ${className}`}>
      <BriefcaseIcon className="h-full w-full" />
      <span className="absolute -right-1 -top-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-white bg-white text-slate-700 shadow-[0_6px_14px_-10px_rgba(15,23,42,0.55)]">
        <MagnifyingGlassIcon className="h-2.5 w-2.5" />
      </span>
    </span>
  );
}

function MobileBottomNav({ items, activeItem, onSelect }) {
  return (
    <nav className="dashboard-ui fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.8rem,env(safe-area-inset-bottom))] pt-2.5 lg:hidden">
      <div className="mx-auto max-w-xl rounded-[1.7rem] border border-slate-200/90 bg-white/92 px-2 py-2 shadow-[0_-18px_48px_-34px_rgba(15,23,42,0.28)] backdrop-blur-2xl">
        <div className="grid grid-cols-4 gap-1.5">
          {items.map((item) => {
            const Icon = item.id === "apply" ? SearchDiscoveryIcon : item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                className={`group flex cursor-pointer flex-col items-center justify-center gap-1 rounded-[1.15rem] px-1.5 py-2 text-[10px] leading-none transition-all duration-200 active:scale-[0.97] ${
                  isActive
                    ? "bg-slate-950 text-white shadow-[0_14px_28px_-18px_rgba(15,23,42,0.45)] ring-1 ring-white/10"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
                key={item.id}
                onClick={() => onSelect(item.id)}
                type="button"
              >
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-[0.95rem] transition ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-slate-500 group-hover:bg-white group-hover:text-slate-800"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className={`whitespace-nowrap ${isActive ? "font-semibold" : "font-medium"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default MobileBottomNav;
