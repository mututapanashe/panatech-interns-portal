import { Link } from "react-router-dom";
import {
  AcademicCapIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  ChartBarIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  MapPinIcon,
  UserCircleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import heroBackground from "../assets/herouz.jpg";
import zimbabweVisual from "../assets/zimbawe.jpg";
import { useAuth } from "../contexts/AuthContext";

const offerings = [
  {
    title: "Smarter Attachment Discovery",
    description:
      "Students can search more intentionally instead of relying on scattered updates and disconnected platforms.",
    icon: BriefcaseIcon,
  },
  {
    title: "Application Tracking",
    description:
      "Every submission, follow-up, and employer response can live in one cleaner workflow.",
    icon: ChartBarIcon,
  },
  {
    title: "Student-Ready Profiles",
    description:
      "Program, level, and student details are captured in a way that makes attachment preparation feel organized.",
    icon: DocumentTextIcon,
  },
];

const universities = [
  "University of Zimbabwe",
  "NUST",
  "Midlands State University",
  "Chinhoyi University of Technology",
  "Harare Institute of Technology",
  "Great Zimbabwe University",
  "Other universities across Zimbabwe",
];

const steps = [
  {
    title: "Create your student profile",
    description:
      "Set up your account with the academic details employers and coordinators care about most.",
  },
  {
    title: "Search and shortlist opportunities",
    description:
      "Compare opportunities and keep your search focused around the placements that match your direction.",
  },
  {
    title: "Track progress with confidence",
    description:
      "Know what has been submitted, what needs follow-up, and where you stand at every stage.",
  },
];

const campusNotes = [
  "Designed around attachment preparation and application flow",
  "Keeps student documents, applications, and follow-ups in one place",
  "Built to reduce confusion and help students stay organized",
];

const overviewHighlights = [
  {
    label: "Reach",
    title: "Zimbabwe-wide",
    description: "Built for students preparing for industrial attachment across the country.",
  },
  {
    label: "Focus",
    title: "Attachment-ready",
    description: "A platform shaped around preparation, application, and follow-through.",
  },
  {
    label: "Result",
    title: "More clarity",
    description: "A cleaner way to know what has been done and what comes next.",
  },
];

function Home() {
  const { getDashboardPath, loading, user, userProfile } = useAuth();
  const dashboardPath = getDashboardPath(userProfile || user);
  const showAuthenticatedCta = !loading && Boolean(user);

  return (
    <div className="overflow-hidden">
      <section
        className="relative isolate flex min-h-[calc(100svh-76px)] overflow-hidden bg-slate-950 bg-cover bg-[position:center_top] px-4 py-14 text-white sm:min-h-[calc(100svh-84px)] sm:px-6 sm:py-16 md:py-20 lg:bg-center"
        style={{
          backgroundImage: `linear-gradient(105deg, rgba(2, 6, 23, 0.72) 0%, rgba(15, 23, 42, 0.5) 48%, rgba(15, 23, 42, 0.12) 100%), url(${heroBackground})`,
        }}
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(249,115,22,0.14),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(14,165,233,0.14),transparent_30%)]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/35 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center">
          <div className="max-w-3xl space-y-7 py-4 sm:py-8">
            <div className="hero-reveal inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 shadow-sm backdrop-blur">
              <AcademicCapIcon className="mr-2 h-5 w-5 text-orange-300" />
              Attachment support for Zimbabwean university students
            </div>

            <div className="hero-reveal hero-reveal-delay-1 space-y-4">
              <h1 className="max-w-4xl text-4xl font-normal leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl xl:text-[3.8rem]">
                Move from scattered searching to a clearer attachment journey.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                panaTECH helps students find industrial attachment opportunities faster,
                organize their search properly, and keep track of every important next step
                in one place.
              </p>
            </div>

            <div className="hero-reveal hero-reveal-delay-2 flex flex-col gap-3 sm:flex-row">
              {showAuthenticatedCta ? (
                <Link
                  className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_-18px_rgba(255,255,255,0.5)] transition hover:bg-slate-100"
                  to={dashboardPath}
                >
                  Open Dashboard
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link
                    className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_-18px_rgba(249,115,22,0.75)] transition hover:bg-orange-600"
                    to="/register"
                  >
                    <UserPlusIcon className="mr-2 h-4.5 w-4.5" />
                    Create Account
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:border-white/40 hover:bg-white/15"
                    to="/login"
                  >
                    <UserCircleIcon className="mr-2 h-4.5 w-4.5" />
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_58%,#fff7ed_100%)] px-4 py-14 sm:px-6 md:py-20"
        id="overview"
      >
        <div className="absolute left-[-10rem] top-10 h-72 w-72 rounded-full bg-orange-200/45 blur-3xl" />
        <div className="absolute right-[-12rem] bottom-0 h-80 w-80 rounded-full bg-sky-200/45 blur-3xl" />

        <div className="relative mx-auto w-full max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-3">
            {overviewHighlights.map((item, index) => {
              const isFeatured = index === 1;

              return (
                <article
                  className={`group relative overflow-hidden rounded-[32px] border p-6 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.34)] transition duration-300 hover:-translate-y-1 ${
                    isFeatured
                      ? "border-slate-900 bg-slate-950 text-white lg:-mt-5"
                      : "border-slate-200 bg-white text-slate-950"
                  }`}
                  key={item.title}
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1 ${
                      index === 0 ? "bg-orange-500" : index === 1 ? "bg-sky-400" : "bg-slate-900"
                    }`}
                  />
                  <div className="flex items-start justify-between gap-5">
                    <span
                      className={`h-px flex-1 ${
                        isFeatured ? "bg-white/20" : "bg-slate-200"
                      }`}
                    />
                    <span
                      className={`text-xs uppercase tracking-[0.24em] ${
                        isFeatured ? "text-slate-400" : "text-slate-400"
                      }`}
                    >
                      0{index + 1}
                    </span>
                  </div>

                  <p
                    className={`mt-8 text-sm uppercase tracking-[0.24em] ${
                      isFeatured ? "text-orange-200" : "text-orange-500"
                    }`}
                  >
                    {item.label}
                  </p>
                  <h3
                    className={`mt-3 text-3xl leading-tight ${
                      isFeatured ? "text-white" : "text-slate-950"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`mt-4 text-sm leading-7 ${
                      isFeatured ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden px-4 py-16 sm:px-6 md:py-24"
        id="offerings"
      >
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent" />
        <div className="absolute bottom-10 right-[-10rem] h-72 w-72 rounded-full bg-orange-200/35 blur-3xl" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[0.74fr_1.26fr] lg:items-stretch">
          <div className="relative overflow-hidden bg-slate-950 px-6 py-5 text-white shadow-[0_28px_80px_-42px_rgba(15,23,42,0.75)] sm:px-8 sm:py-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(249,115,22,0.35),transparent_32%),radial-gradient(circle_at_90%_70%,rgba(14,165,233,0.22),transparent_30%)]" />
            <div className="relative flex h-full flex-col justify-between gap-12">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-300">
                  What We Offer
                </p>
                <h2 className="mt-5 hidden text-4xl leading-tight text-white sm:block sm:text-5xl">
                  The platform flow, without the noise.
                </h2>
                <p className="mt-5 hidden text-base leading-8 text-slate-300 sm:block">
                  Instead of scattering updates across chats, emails, and spreadsheets,
                  panaTECH gives students one clearer journey from discovery to follow-up.
                </p>
              </div>

              <div className="hidden border-t border-white/15 pt-6 sm:block">
                <p className="text-xs uppercase tracking-[0.26em] text-slate-400">
                  Built Around
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Discovery", "Preparation", "Tracking"].map((item) => (
                    <span
                      className="border border-white/15 px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-200"
                      key={item}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            {offerings.map((item, index) => {
              const Icon = item.icon;
              const isMiddle = index === 1;

              return (
                <article
                  className={`group relative overflow-hidden border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.28)] transition duration-300 hover:-translate-y-1 hover:border-slate-300 sm:p-7 ${
                    isMiddle ? "lg:ml-10" : "lg:mr-10"
                  }`}
                  key={item.title}
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-orange-500" />
                  <div className="absolute right-6 top-5 font-display text-6xl leading-none text-slate-100 transition group-hover:text-orange-100">
                    0{index + 1}
                  </div>

                  <div className="relative grid gap-5 sm:grid-cols-[4.25rem_1fr]">
                    <div className="flex h-14 w-14 items-center justify-center border border-slate-200 bg-slate-50 text-slate-950 transition group-hover:border-orange-200 group-hover:bg-orange-50 group-hover:text-orange-500">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-3xl leading-snug text-slate-950">
                        {item.title}
                      </h3>
                      <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 md:py-24" id="students">
        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-7">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-300">
              For Zimbabwean Students
            </p>
            <div className="-mx-4 sm:mx-0">
              <img
                alt="Zimbabwe flag visual"
                className="h-44 w-screen object-cover sm:h-56 sm:w-full lg:h-64"
                src={zimbabweVisual}
              />
            </div>
            <h2 className="max-w-2xl text-4xl leading-tight text-white sm:text-5xl">
              Built for students across Zimbabwean universities.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              The experience helps students discover attachment opportunities, prepare
              documents properly, and keep their progress organized from one place.
            </p>

            <div className="grid gap-4 border-l border-white/15 pl-5">
              {campusNotes.map((note) => (
                <p className="flex items-start gap-3 text-sm leading-7 text-slate-200" key={note}>
                  <CheckCircleIcon className="mt-1 h-5 w-5 flex-shrink-0 text-orange-300" />
                  {note}
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/15 pb-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-orange-300">
                    University Community
                  </p>
                  <h3 className="mt-3 text-3xl leading-snug text-white">
                    Supporting students across major institutions
                  </h3>
                </div>
                <span className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Zimbabwe-wide
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {universities.map((item) => (
                  <span
                    className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100"
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 md:py-24" id="journey">
        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-500">
              How It Works
            </p>
            <h2 className="text-4xl leading-tight text-slate-950 sm:text-5xl">
              A straightforward path from registration to follow-up
            </h2>
            <p className="text-lg leading-8 text-slate-600">
              From profile setup to application follow-up, every step is arranged to keep
              the attachment journey clear and manageable.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-5 top-0 hidden h-full w-px bg-slate-200 sm:block" />
            <div className="space-y-9">
              {steps.map((step, index) => (
                <article className="relative grid gap-4 sm:grid-cols-[4rem_1fr]" key={step.title}>
                  <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                    0{index + 1}
                  </div>
                  <div className="border-b border-slate-200 pb-8">
                    <h3 className="text-3xl leading-snug text-slate-950">{step.title}</h3>
                    <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 flex items-start gap-4 border-l-4 border-orange-400 bg-orange-50/70 px-5 py-5">
              <CheckCircleIcon className="mt-1 h-6 w-6 flex-shrink-0 text-orange-500" />
              <div>
                <h3 className="text-2xl leading-snug text-slate-950">
                  Less confusion, more follow-through
                </h3>
                <p className="mt-2 text-base leading-8 text-slate-600">
                  panaTECH keeps each action visible so students can move from preparation
                  to submission with more confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 pt-6 sm:px-6 md:pb-24" id="contact">
        <div className="mx-auto w-full max-w-7xl overflow-hidden bg-slate-950 text-white">
          <div className="grid gap-10 bg-[radial-gradient(circle_at_15%_15%,rgba(249,115,22,0.28),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(14,165,233,0.22),transparent_28%)] px-6 py-10 md:px-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-300">
                Contact
              </p>
              <h2 className="text-4xl leading-tight text-white sm:text-5xl">
                Need help, have a question, or want to connect around student attachment support?
              </h2>
              <p className="text-lg leading-8 text-slate-300">
                Get guidance, ask questions, or connect with the team when you need support
                around the attachment process.
              </p>
            </div>

            <div className="flex flex-col justify-between gap-8">
              <div className="grid gap-5 border-y border-white/15 py-6 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <EnvelopeIcon className="mt-1 h-6 w-6 flex-shrink-0 text-orange-300" />
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-slate-400">
                      Email Support
                    </p>
                    <p className="mt-2 text-base text-white">support@panatech.co.zw</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPinIcon className="mt-1 h-6 w-6 flex-shrink-0 text-orange-300" />
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-slate-400">
                      Zimbabwe Focus
                    </p>
                    <p className="mt-2 text-base leading-7 text-white">
                      Built around one consistent attachment journey.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.26em] text-orange-300">
                  Get Started
                </p>
                <h3 className="mt-4 text-3xl leading-snug text-white">
                  Ready to build your student profile and begin your attachment search?
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                  Create an account to begin with a cleaner, more organized way to manage
                  your industrial attachment journey.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  {showAuthenticatedCta ? (
                    <Link
                      className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                      to={dashboardPath}
                    >
                      Open Dashboard
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Link>
                  ) : (
                    <>
                      <Link
                        className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                        to="/register"
                      >
                        <UserPlusIcon className="mr-2 h-4.5 w-4.5" />
                        Create Account
                      </Link>
                      <Link
                        className="inline-flex items-center justify-center rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                        to="/login"
                      >
                        <UserCircleIcon className="mr-2 h-4.5 w-4.5" />
                        Login
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
