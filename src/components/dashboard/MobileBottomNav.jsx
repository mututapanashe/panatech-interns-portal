import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function MobileBottomNav({ items, activeItem, onSelect }) {
  return (
    <nav
      aria-label="Student dashboard navigation"
      className="dashboard-ui fixed inset-x-0 bottom-0 z-[70] block lg:hidden"
    >
      <div
        className="border-t border-slate-300/80 bg-[linear-gradient(180deg,rgba(255,244,238,0.98)_0%,rgba(238,245,255,0.99)_100%)] shadow-[0_-18px_42px_-24px_rgba(15,23,42,0.28)]"
        style={{ paddingBottom: "max(0.7rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto max-w-xl px-3 pt-2">
        <div className="grid grid-cols-4 gap-1.5">
          {items.map((item) => {
            const Icon = item.id === "apply" ? MagnifyingGlassIcon : item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                className={`group flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[1.05rem] px-1 py-2 text-[11px] leading-none transition-all duration-200 active:scale-[0.97] ${
                  isActive
                    ? "bg-slate-950 text-white shadow-[0_14px_28px_-18px_rgba(15,23,42,0.45)] ring-1 ring-white/10"
                    : "text-slate-600 hover:bg-white/70 hover:text-slate-950"
                }`}
                key={item.id}
                onClick={() => onSelect(item.id)}
                type="button"
              >
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-[0.95rem] transition ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-slate-600 group-hover:bg-white group-hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-[19px] w-[19px] stroke-[1.9]" />
                </span>
                <span
                  className={`whitespace-nowrap tracking-[0.01em] ${
                    isActive ? "font-semibold text-white" : "font-semibold text-slate-800"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        </div>
      </div>
    </nav>
  );
}

export default MobileBottomNav;
