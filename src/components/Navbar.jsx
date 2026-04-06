import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bars3Icon, UserCircleIcon, UserPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo.png";

const publicNavLinks = [
  { label: "What We Offer", to: "/#offerings" },
  { label: "How It Works", to: "/#journey" },
  { label: "Contact", to: "/#contact" },
];

const studentNavLinks = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "My Profile", to: "/dashboard#profile-overview" },
  { label: "Support", to: "/#contact" },
];

const adminNavLinks = [
  { label: "Dashboard", to: "/admin-dashboard" },
  { label: "Overview", to: "/admin-dashboard#admin-overview" },
  { label: "Support", to: "/#contact" },
];

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const isMinimalAuthNavbar =
    location.pathname === "/login" || location.pathname === "/register";
  const isDashboardRoute =
    ["/dashboard", "/search", "/cv", "/applications", "/student-dashboard", "/admin-dashboard"].includes(
      location.pathname,
    );
  const isAdminView = isAdmin || location.pathname === "/admin-dashboard";
  const contextualNavLinks =
    user || isDashboardRoute ? (isAdminView ? adminNavLinks : studentNavLinks) : publicNavLinks;

  const handleMenuClose = () => setIsOpen(false);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate("/login", {
      replace: true,
      state: { loggedOut: true },
    });
  };

  const isActiveLink = (to) => {
    const currentPathWithHash = `${location.pathname}${location.hash}`;
    return currentPathWithHash === to || location.pathname === to;
  };

  if (isMinimalAuthNavbar) {
    return (
      <header className="relative z-20 px-4 pt-2 sm:px-6 sm:pt-3">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center">
          <Link className="flex items-center gap-3" to="/">
            <img alt="panaTECH logo" className="h-10 w-auto object-contain" src={logo} />
            <div className="leading-tight">
              <p className="font-display text-lg tracking-tight text-slate-950">panaTECH</p>
              <p className="text-xs uppercase tracking-[0.28em] text-orange-500">
                Attachment Hub
              </p>
            </div>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/94 shadow-[0_14px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link className="flex items-center gap-3" to="/">
          <img alt="panaTECH logo" className="h-10 w-auto object-contain" src={logo} />
          <div className="leading-tight">
            <p className="font-display text-lg tracking-tight text-slate-950">panaTECH</p>
            <p className="text-xs uppercase tracking-[0.28em] text-orange-500">
              Attachment Hub
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {contextualNavLinks.map((item) => (
            <Link className="group inline-flex items-center gap-2 py-2 text-sm font-medium" key={item.label} to={item.to}>
              <span
                className={
                  isActiveLink(item.to)
                    ? "text-slate-950"
                    : "text-slate-600 transition-colors hover:text-orange-600"
                }
              >
                {item.label}
              </span>
              <span
                className={[
                  "h-px bg-orange-500 transition-all duration-200",
                  isActiveLink(item.to) ? "w-5" : "w-0 group-hover:w-5",
                ].join(" ")}
              />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          {user ? (
            <button
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-orange-200 hover:bg-orange-50"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          ) : isDashboardRoute ? (
            <Link
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-orange-200 hover:bg-orange-50"
              to="/"
            >
              Back Home
            </Link>
          ) : (
            <>
              <Link
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-orange-600"
                to="/login"
              >
                <UserCircleIcon className="h-4.5 w-4.5" />
                Login
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_-16px_rgba(249,115,22,0.75)] transition hover:bg-orange-600"
                to="/register"
              >
                <UserPlusIcon className="h-4.5 w-4.5" />
                Create Account
              </Link>
            </>
          )}
        </div>

        <button
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 lg:hidden"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
            {contextualNavLinks.map((item) => (
              <Link
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-orange-600"
                key={item.label}
                onClick={handleMenuClose}
                to={item.to}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-2 grid gap-2">
              {user ? (
                <button
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700"
                  onClick={handleLogout}
                  type="button"
                >
                  Logout
                </button>
              ) : isDashboardRoute ? (
                <Link
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700"
                  onClick={handleMenuClose}
                  to="/"
                >
                  Back Home
                </Link>
              ) : (
                <>
                  <Link
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700"
                    onClick={handleMenuClose}
                    to="/login"
                  >
                    <UserCircleIcon className="h-4.5 w-4.5" />
                    Login
                  </Link>
                  <Link
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-center text-sm font-semibold text-white"
                    onClick={handleMenuClose}
                    to="/register"
                  >
                    <UserPlusIcon className="h-4.5 w-4.5" />
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
