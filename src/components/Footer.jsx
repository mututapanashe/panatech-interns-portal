import { Link, useLocation } from "react-router-dom";
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";
import logo from "../assets/logo.png";

function Footer() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const brandLockup = (
    <div className="flex items-center gap-3 text-left">
      <img alt="panaTECH logo" className="h-10 w-auto object-contain" src={logo} />
      <div className="leading-tight">
        <p className="font-display text-lg tracking-tight text-white">panaTECH</p>
        <p className="text-xs uppercase tracking-[0.28em] text-orange-300">Attachment Hub</p>
      </div>
    </div>
  );

  const fullFooter = (
    <footer className="bg-slate-950 pt-10 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 py-10 md:px-4 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-5">
            {brandLockup}

            <p className="max-w-xl text-sm leading-7 text-slate-300">
              Designed for students who want a cleaner way to discover industrial
              attachment opportunities, manage applications, and stay ready for the next
              career step.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-xl text-white">Explore</h3>
            <div className="grid gap-3 text-sm text-slate-300">
              <Link className="transition hover:text-orange-300" to="/#offerings">
                What We Offer
              </Link>
              <Link className="transition hover:text-orange-300" to="/#journey">
                How It Works
              </Link>
              <Link className="transition hover:text-orange-300" to="/#students">
                For Zimbabwean Students
              </Link>
              <Link className="transition hover:text-orange-300" to="/#contact">
                Contact
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-xl text-white">Reach Us</h3>
            <div className="grid gap-4 text-sm text-slate-300">
              <p className="flex items-start gap-3">
                <EnvelopeIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-300" />
                support@panatech.co.zw
              </p>
              <p className="flex items-start gap-3">
                <PhoneIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-300" />
                +263 71 149 0290
              </p>
              <p className="flex items-start gap-3">
                <MapPinIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-300" />
                Harare, Zimbabwe
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-4 text-sm text-slate-400 md:px-4">
          <p>&copy; {new Date().getFullYear()} panaTECH. Built for attachment discovery, tracking, and student readiness.</p>
        </div>
      </div>
    </footer>
  );

  if (isAuthPage) {
    return (
      <>
        <footer className="bg-slate-950 py-5 text-white md:hidden">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-3 px-4">
            {brandLockup}
            <p className="text-center text-xs leading-6 text-slate-400">
              Student attachment platform built for clearer discovery and tracking.
            </p>
          </div>
        </footer>

        <div className="hidden md:block">{fullFooter}</div>
      </>
    );
  }

  return fullFooter;
}

export default Footer;
