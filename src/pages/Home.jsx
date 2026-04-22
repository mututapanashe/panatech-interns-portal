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

const progressItems = [
  { label: "Profile setup", tone: "bg-orange-400", width: "w-4/5" },
  { label: "Applications sent", tone: "bg-sky-400", width: "w-3/5" },
  { label: "Follow-ups", tone: "bg-slate-300", width: "w-2/5" },
];

const applicationStates = [
  { label: "Applied", tone: "bg-sky-400" },
  { label: "Under Review", tone: "bg-orange-400" },
  { label: "Interview", tone: "bg-emerald-400" },
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
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_-18px_rgba(255,255,255,0.5)] transition hover:bg-slate-100"
                  to={dashboardPath}
                >
                  Open Dashboard
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link
                    className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_-18px_rgba(249,115,22,0.75)] transition hover:bg-orange-600"
                    to="/register"
                  >
                    <UserPlusIcon className="mr-2 h-4.5 w-4.5" />
                    Create Account
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:border-white/40 hover:bg-white/15"
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

      <section className="px-4 py-12 sm:px-6 md:py-16" id="overview">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.2)]">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Reach</p>
              <p className="mt-3 font-display text-2xl text-slate-950">Zimbabwe-wide</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Built for students preparing for industrial attachment across the country.
              </p>
            </div>
            <div className="rounded-[24px] border border-slate-900 bg-slate-950 p-5 text-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.42)]">
              <p className="text-sm uppercase tracking-[0.2em] text-orange-200">Focus</p>
              <p className="mt-3 font-display text-2xl text-white">Attachment-ready</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                A platform shaped around preparation, application, and follow-through.
              </p>
            </div>
            <div className="rounded-[24px] border border-orange-200 bg-orange-50 p-5 shadow-[0_20px_50px_-28px_rgba(249,115,22,0.18)]">
              <p className="text-sm uppercase tracking-[0.2em] text-orange-500">Result</p>
              <p className="mt-3 font-display text-2xl text-slate-950">More clarity</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                A cleaner way to know what has been done and what comes next.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="rounded-[34px] border border-slate-200 bg-white p-4 shadow-[0_28px_70px_-34px_rgba(15,23,42,0.28)]">
              <div className="rounded-[28px] bg-[linear-gradient(140deg,#0f172a_0%,#1d4ed8_58%,#f97316_100%)] p-5 text-white">
                <p className="text-sm uppercase tracking-[0.24em] text-orange-200">
                  Student View
                </p>
                <h2 className="mt-3 text-3xl leading-tight text-white">
                  Search, prepare, and track in one steady flow
                </h2>

                <div className="mt-6 grid gap-4 sm:grid-cols-[1.08fr_0.92fr]">
                  <div className="rounded-[24px] border border-white/10 bg-white/10 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">Recommended role</p>
                        <p className="mt-1 text-xs text-slate-300">Software support trainee</p>
                      </div>
                      <span className="rounded-full bg-orange-400/20 px-3 py-1 text-xs text-orange-100">
                        92% match
                      </span>
                    </div>

                    <div className="mt-5 rounded-2xl bg-white/10 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-orange-200">
                        Built For
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-100">
                        Students preparing documents, shortlisting placements, and tracking progress with more confidence.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-white/10 p-4">
                    <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-300">
                      <span>Applications</span>
                      <span>Updated</span>
                    </div>
                    <div className="grid gap-2">
                      {applicationStates.map((state) => (
                        <div
                          className="flex items-center justify-between rounded-xl bg-white/8 px-3 py-2"
                          key={state.label}
                        >
                          <span className="text-sm text-slate-100">{state.label}</span>
                          <span className={`h-2.5 w-2.5 rounded-full ${state.tone}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[34px] border border-slate-200 bg-white p-6 shadow-[0_28px_70px_-34px_rgba(15,23,42,0.24)]">
              <p className="text-sm uppercase tracking-[0.24em] text-orange-500">
                Readiness
              </p>
              <h2 className="mt-3 text-3xl leading-tight text-slate-950">
                Keep every important attachment step visible.
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                A simple workspace helps students stay aware of preparation, submissions, and follow-ups without guessing.
              </p>

              <div className="mt-6 grid gap-4">
                {progressItems.map((item) => (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4" key={item.label}>
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-700">
                      <span>{item.label}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div className={`h-2 rounded-full ${item.tone} ${item.width}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 md:py-20" id="offerings">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-500">
              What We Offer
            </p>
            <h2 className="mt-4 text-4xl leading-tight text-slate-950 sm:text-5xl">
              A student platform shaped around the attachment process
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              The experience is designed around how students search, prepare documents, and
              manage multiple applications while balancing academic life.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {offerings.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  className="group rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.24)] transition hover:-translate-y-1 hover:shadow-[0_30px_70px_-28px_rgba(15,23,42,0.3)]"
                  key={item.title}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-3xl leading-snug text-slate-950">{item.title}</h3>
                  <p className="mt-4 text-base leading-8 text-slate-600">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 md:py-20" id="students">
        <div className="mx-auto grid w-full max-w-7xl gap-10 rounded-[40px] bg-slate-950 px-6 py-10 text-white shadow-[0_30px_80px_-28px_rgba(15,23,42,0.85)] md:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-300">
              For Zimbabwean Students
            </p>
            <h2 className="text-4xl leading-tight text-white sm:text-5xl">
              Built for students across Zimbabwean universities.
            </h2>
            <p className="text-base leading-8 text-slate-300 sm:text-lg">
              The experience is designed to help students discover attachment opportunities,
              prepare documents properly, and keep their progress organized from one place.
            </p>

            <div className="grid gap-3">
              {campusNotes.map((note) => (
                <p
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-200"
                  key={note}
                >
                  <CheckCircleIcon className="mt-1 h-5 w-5 flex-shrink-0 text-orange-300" />
                  {note}
                </p>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-orange-300">
                    University Community
                  </p>
                  <h3 className="mt-3 text-2xl leading-snug text-white">
                    Supporting students across major institutions
                  </h3>
                </div>
                <span className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-200">
                  Zimbabwe-wide
                </span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {universities.map((item) => (
                  <div
                    className={`rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 ${
                      item === "Other universities across Zimbabwe" ? "sm:col-span-2" : ""
                    }`}
                    key={item}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_0.82fr]">
              <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.24),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))] p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-orange-300">
                  Student Journey
                </p>
                <div className="mt-5 grid gap-4">
                  {steps.map((step, index) => (
                    <div
                      className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4"
                      key={step.title}
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white text-sm font-bold text-slate-950">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-base font-semibold text-white">{step.title}</p>
                          <p className="mt-1 text-sm leading-7 text-slate-300">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-orange-300">
                  What Students Get
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  A clearer structure for preparing, applying, and following through.
                </p>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl bg-white/8 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                      Discovery
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-100">
                      A better way to shortlist opportunities that fit your direction.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/8 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                      Preparation
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-100">
                      One place to keep your documents and next actions ready.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/8 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                      Tracking
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-100">
                      Better visibility from the first application to the final response.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 md:py-20" id="journey">
        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-500">
              How It Works
            </p>
            <h2 className="text-4xl leading-tight text-slate-950 sm:text-5xl">
              A straightforward path from registration to follow-up
            </h2>
            <p className="text-lg leading-8 text-slate-600">
              Students should be able to understand the flow quickly and keep moving without
              losing track of important steps.
            </p>
          </div>

          <div className="grid gap-5">
            {steps.map((step, index) => (
              <article
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.22)]"
                key={step.title}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sm font-bold text-sky-700">
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="text-3xl leading-snug text-slate-950">{step.title}</h3>
                    <p className="mt-3 text-base leading-8 text-slate-600">{step.description}</p>
                  </div>
                </div>
              </article>
            ))}

            <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_55%,#fff7ed_100%)] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-orange-500 shadow-sm">
                  <CheckCircleIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-3xl leading-snug text-slate-950">
                    Less confusion, more follow-through
                  </h3>
                  <p className="mt-3 text-base leading-8 text-slate-600">
                    The experience is designed to help students stay focused on the next
                    practical action instead of guessing where they are in the process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 md:py-20" id="contact">
        <div className="mx-auto grid w-full max-w-7xl gap-8 rounded-[40px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_45%,#fff7ed_100%)] p-6 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.22)] md:p-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-500">
              Contact
            </p>
            <h2 className="text-4xl leading-tight text-slate-950 sm:text-5xl">
              Need help, have a question, or want to connect around student attachment support?
            </h2>
            <p className="text-lg leading-8 text-slate-600">
              Students should always have a clear place to go when they need more guidance or
              a direct way to reach the team.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6">
              <EnvelopeIcon className="h-7 w-7 text-orange-500" />
              <h3 className="mt-5 text-3xl leading-snug text-slate-950">Email Support</h3>
              <p className="mt-3 text-base leading-8 text-slate-600">
                support@panatech.co.zw
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6">
              <MapPinIcon className="h-7 w-7 text-orange-500" />
              <h3 className="mt-5 text-3xl leading-snug text-slate-950">Zimbabwe Focus</h3>
              <p className="mt-3 text-base leading-8 text-slate-600">
                Built for students across Zimbabwe with one consistent attachment journey.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white md:col-span-2">
              <p className="text-sm uppercase tracking-[0.26em] text-orange-300">Get Started</p>
              <h3 className="mt-4 text-3xl leading-snug text-white">
                Ready to build your student profile and begin your attachment search?
              </h3>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                Create an account to begin with a cleaner, more organized way to manage your
                industrial attachment journey.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {showAuthenticatedCta ? (
                  <Link
                    className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                    to={dashboardPath}
                  >
                    Open Dashboard
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                      to="/register"
                    >
                      <UserPlusIcon className="mr-2 h-4.5 w-4.5" />
                      Create Account
                    </Link>
                    <Link
                      className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
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
      </section>
    </div>
  );
}

export default Home;
