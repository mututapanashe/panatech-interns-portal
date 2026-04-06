import { useMemo, useState } from "react";
import {
  Bars3Icon,
  BellIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import logo from "../../assets/logo.png";

function getInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (!parts.length) {
    return "PT";
  }

  return parts.map((part) => part[0]?.toUpperCase() || "").join("");
}

function ProfileAvatar({ name, className = "", textClassName = "" }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#f97316_0%,#0f172a_100%)] text-white shadow-[0_14px_30px_-18px_rgba(15,23,42,0.45)] ${className}`.trim()}
    >
      <span className={`font-semibold uppercase tracking-[0.06em] ${textClassName}`.trim()}>
        {getInitials(name)}
      </span>
    </span>
  );
}

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
  notifications = [],
  onNotificationSelect,
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const unreadCount = notifications.length;
  const previewNotifications = useMemo(() => notifications.slice(0, 5), [notifications]);

  const handleNotificationSelect = async (notification) => {
    setNotificationsOpen(false);

    if (notification?.sectionId && typeof onNotificationSelect === "function") {
      await onNotificationSelect(notification.sectionId);
    }
  };

  const handleNavSelect = async (sectionId) => {
    setNotificationsOpen(false);
    await onSelect(sectionId);
  };

  const navContent = (
    <nav className="dashboard-ui grid content-start gap-1.5 lg:gap-2">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeItem === item.id;

        return (
            <button
            className={`group flex w-full cursor-pointer items-center gap-2.5 rounded-[18px] px-3.5 py-2.5 text-left text-[13px] font-medium transition lg:gap-3 lg:rounded-[22px] lg:px-4 lg:py-3.5 lg:text-sm ${
              isActive
                ? "bg-slate-950 text-white shadow-[0_20px_48px_-24px_rgba(15,23,42,0.45)]"
                : "text-slate-700 hover:bg-white hover:text-slate-950 hover:shadow-[0_16px_36px_-28px_rgba(15,23,42,0.28)]"
            }`}
            key={item.id}
            onClick={() => void handleNavSelect(item.id)}
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
      <aside className="dashboard-ui hidden w-72 flex-shrink-0 self-start rounded-[32px] border border-slate-300/80 bg-[linear-gradient(180deg,#ffffff_0%,#eef3f8_100%)] p-5 shadow-[0_28px_76px_-40px_rgba(15,23,42,0.24)] lg:block">
        <div className="rounded-[24px] border border-slate-300/80 bg-[linear-gradient(180deg,#ffffff_0%,#f1f5f9_100%)] p-4 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.2)]">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/92 shadow-[0_16px_36px_-24px_rgba(15,23,42,0.22)]">
            <img alt="panaTECH logo" className="h-7 w-auto object-contain" src={logo} />
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-600">
            {title}
          </p>
          <div className="mt-3 flex items-start gap-2.5">
            <ProfileAvatar
              className="mt-0.5 h-10 w-10 flex-shrink-0"
              name={subtitle}
              textClassName="text-[12px]"
            />
            <p className="min-w-0 break-words text-2xl leading-tight text-slate-950">{subtitle}</p>
          </div>
        </div>
        <div className="mt-6 rounded-[28px] border border-slate-200/80 bg-slate-100/90 p-3">{navContent}</div>
      </aside>

      <div className="lg:hidden">
        <div className="dashboard-ui fixed inset-x-0 top-0 z-50 border-b border-slate-800/90 bg-slate-950 shadow-[0_12px_28px_-20px_rgba(15,23,42,0.45)]">
          <div className="mx-auto max-w-7xl px-4 pb-2 pt-[max(0.58rem,env(safe-area-inset-top))] sm:px-6">
            <div className="flex items-center gap-2.5 px-0.5 py-1">
              <button
                className="inline-flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-[0.95rem] border border-white/12 bg-white/8 text-slate-100 shadow-[0_10px_24px_-22px_rgba(15,23,42,0.28)] transition duration-200 hover:-translate-y-0.5 hover:border-orange-300/70 hover:bg-white/14 hover:text-orange-200 active:scale-[0.96]"
                onClick={() => {
                  setNotificationsOpen(false);
                  onOpen();
                }}
                type="button"
              >
                <Bars3Icon className="h-4.5 w-4.5" />
              </button>
              <div className="min-w-0 flex-1 px-1.5 py-0.5">
                <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-orange-300">
                  {mobileTitle}
                </p>

                <div className="mt-0.5 flex items-center gap-2">
                  <ProfileAvatar
                    className="h-6 w-6 flex-shrink-0"
                    name={mobileSubtitle}
                    textClassName="text-[9px]"
                  />
                  <p className="min-w-0 break-words pr-1 text-[13px] leading-5 text-white">
                    {mobileSubtitle}
                  </p>
                </div>
              </div>
              <button
                aria-label="Open notifications"
                className="relative inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[0.95rem] border border-white/12 bg-white/8 text-slate-100 shadow-[0_10px_24px_-22px_rgba(15,23,42,0.28)] transition duration-200 hover:-translate-y-0.5 hover:border-orange-300/70 hover:bg-white/14 hover:text-orange-200 active:scale-[0.96]"
                onClick={() => setNotificationsOpen((current) => !current)}
                type="button"
              >
                <BellIcon className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full border border-slate-950 bg-orange-500 px-1 text-[10px] font-semibold text-white shadow-[0_10px_20px_-12px_rgba(249,115,22,0.8)]">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="h-[5.05rem] sm:h-[5.3rem]" />

        {notificationsOpen && (
          <>
            <button
              aria-label="Close notifications"
              className="fixed inset-0 z-[55] bg-transparent lg:hidden"
              onClick={() => setNotificationsOpen(false)}
              type="button"
            />
            <div className="dashboard-ui fixed right-3 top-[calc(env(safe-area-inset-top)+4.65rem)] z-[60] w-[min(24rem,calc(100vw-1.5rem))] overflow-hidden rounded-[26px] border border-slate-300/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(241,245,249,0.98)_100%)] shadow-[0_28px_80px_-34px_rgba(15,23,42,0.35)] lg:hidden">
              <div className="flex items-center justify-between border-b border-slate-200/90 px-4 py-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Notifications
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {unreadCount > 0
                      ? `${unreadCount} important update${unreadCount === 1 ? "" : "s"}`
                      : "No new updates right now"}
                  </p>
                </div>
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-orange-200 hover:text-orange-600"
                  onClick={() => setNotificationsOpen(false)}
                  type="button"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>

              {previewNotifications.length > 0 ? (
                <div className="max-h-[22rem] overflow-y-auto p-3">
                  <div className="grid gap-2.5">
                    {previewNotifications.map((notification) => (
                      <button
                        className="w-full rounded-[20px] border border-slate-200/90 bg-white/90 px-4 py-3 text-left shadow-[0_14px_34px_-26px_rgba(15,23,42,0.24)] transition hover:border-orange-200 hover:bg-orange-50/40"
                        key={notification.id}
                        onClick={() => void handleNotificationSelect(notification)}
                        type="button"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-1 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                              notification.tone === "positive"
                                ? "bg-emerald-500"
                                : notification.tone === "warning"
                                  ? "bg-orange-500"
                                  : "bg-sky-500"
                            }`}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-950">
                              {notification.title}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-600">
                              {notification.body}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="px-4 py-5 text-sm leading-7 text-slate-600">
                  Important updates about applications, CV readiness, and activity will appear here.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-[2px] lg:hidden" onClick={onClose}>
          <div
            className="dashboard-ui flex h-full w-[86%] max-w-[20rem] flex-col overflow-hidden rounded-r-[32px] border-r border-slate-300/80 bg-[linear-gradient(180deg,#ffffff_0%,#eef3f8_100%)] p-4 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.28)]"
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
            <div className="mt-3 min-w-0 rounded-[22px] border border-slate-300/80 bg-[linear-gradient(180deg,#ffffff_0%,#f1f5f9_100%)] p-3 shadow-[0_16px_40px_-26px_rgba(15,23,42,0.18)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-600">
                {title}
              </p>
              <div className="mt-2.5 flex items-start gap-2.5">
                <ProfileAvatar
                  className="mt-0.5 h-8 w-8 flex-shrink-0"
                  name={subtitle}
                  textClassName="text-[10px]"
                />
                <p className="min-w-0 break-words pr-2 text-[15px] leading-6 text-slate-950 sm:text-base">
                  {subtitle}
                </p>
              </div>
            </div>
            <div className="mt-4 flex-1 rounded-[24px] border border-slate-200/80 bg-white/92 p-2.5 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.16)]">
              {navContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
