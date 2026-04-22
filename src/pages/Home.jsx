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

      <section className="border-y border-slate-200 bg-white px-4 py-10 sm:px-6" id="overview">
        <div className="mx-auto grid w-full max-w-7xl gap-8 md:grid-cols-3 md:divide-x md:divide-slate-200">
          {[
            {
              label: "Reach",
              title: "Zimbabwe-wide",
              text: "Built for students preparing for industrial attachment across the country.",
            },
            {
              label: "Focus",
              title: "Attachment-ready",
              text: "A platform shaped around preparation, application, and follow-through.",
            },
            {
              label: "Result",
              title: "More clarity",
              text: "A cleaner way to know what has been done and what comes next.",
            },
          ].map((item) => (
            <div className="md:px-8 first:md:pl-0 last:md:pr-0" key={item.title}>
              <p className="text-sm uppercase tracking-[0.28em] text-orange-500">{item.label}</p>
              <p className="mt-3 font-display text-3xl leading-tight text-slate-950">
                {item.title}
              </p>
              <p className="mt-3 max-w-sm text-sm leading-7 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 md:py-24" id="offerings">
        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-500">
              What We Offer
            </p>
            <h2 className="mt-4 text-4xl leading-tight text-slate-950 sm:text-5xl">
              The platform flow, without the noise.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Instead of scattering updates across chats, emails, and spreadsheets, panaTECH
              gives students one clearer journey from discovery to follow-up.
            </p>
          </div>

          <div className="border-y border-slate-200">
            {offerings.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  className="group grid gap-5 border-b border-slate-200 py-8 last:border-b-0 sm:grid-cols-[4rem_1fr] sm:py-10"
                  key={item.title}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-orange-200 bg-orange-50 text-orange-500 transition group-hover:scale-105 group-hover:border-orange-400">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-3xl leading-snug text-slate-950">{item.title}</h3>
                    <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
                      {item.description}
                    </p>
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

          <div className="space-y-10">
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

            <div className="grid gap-8 border-t border-white/15 pt-8 md:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-orange-300">
                  Student Journey
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  A clear route from account setup to follow-through.
                </p>
              </div>

              <div className="relative border-l border-white/15 pl-6">
                {steps.map((step, index) => (
                  <div className="relative pb-8 last:pb-0" key={step.title}>
                    <span className="absolute -left-[2.1rem] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 ring-8 ring-slate-950" />
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      Step 0{index + 1}
                    </p>
                    <h4 className="mt-2 text-2xl leading-snug text-white">{step.title}</h4>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{step.description}</p>
                  </div>
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
              Students should understand the flow quickly and keep moving without losing
              track of important steps.
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
                  The experience keeps students focused on the next practical action instead
                  of guessing where they are in the process.
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
                Students should always have a clear place to go when they need more guidance
                or a direct way to reach the team.
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
        </div>
      </section>
    </div>
  );
}

export default Home;
