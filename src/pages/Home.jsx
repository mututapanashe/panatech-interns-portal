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
} from "@heroicons/react/24/outline";
import heroImage from "../assets/hero.png";

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
  "CUT and other universities",
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
  "Open to students from universities across Zimbabwe",
  "Built around attachment preparation and application flow",
  "Designed to reduce confusion and keep students organized",
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
  return (
    <div className="overflow-hidden">
      <section className="relative px-4 pb-14 pt-8 sm:px-6 md:pb-20">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-8rem] top-6 h-64 w-64 rounded-full bg-orange-300/30 blur-3xl" />
          <div className="absolute right-[-6rem] top-10 h-72 w-72 rounded-full bg-sky-300/35 blur-3xl" />
          <div className="absolute bottom-[-8rem] left-1/3 h-72 w-72 rounded-full bg-slate-300/20 blur-3xl" />
        </div>

        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
              <AcademicCapIcon className="mr-2 h-5 w-5 text-orange-500" />
              Attachment support for Zimbabwean university students
            </div>

            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-normal leading-[1.08] tracking-[-0.03em] text-slate-950 sm:text-5xl xl:text-[3.8rem]">
                Move from scattered searching to a clearer attachment journey.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                panaTECH helps students from any university in Zimbabwe find industrial
                attachment opportunities faster, organize their search properly, and keep
                track of every important next step.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_-18px_rgba(249,115,22,0.75)] transition hover:bg-orange-600"
                to="/register"
              >
                Create Account
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
                to="/login"
              >
                Login
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.2)]">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Reach</p>
                <p className="mt-3 font-display text-2xl text-slate-950">Zimbabwe-wide</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Built for students from universities across the country.
                </p>
              </div>
              <div className="rounded-[24px] border border-slate-800 bg-slate-950 p-5 text-white shadow-[0_20px_50px_-24px_rgba(15,23,42,0.45)]">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Focus</p>
                <p className="mt-3 font-display text-2xl text-white">Attachment-ready</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  A platform shaped around preparation, application, and follow-through.
                </p>
              </div>
              <div className="rounded-[24px] border border-orange-200 bg-orange-50 p-5 shadow-[0_20px_50px_-24px_rgba(249,115,22,0.18)]">
                <p className="text-sm uppercase tracking-[0.2em] text-orange-500">Result</p>
                <p className="mt-3 font-display text-2xl text-slate-950">More clarity</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  A cleaner way to know what has been done and what comes next.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-12 top-8 hidden h-28 w-28 rounded-full bg-orange-400/25 blur-3xl md:block" />
            <div className="absolute -left-12 bottom-10 hidden h-28 w-28 rounded-full bg-sky-400/25 blur-3xl md:block" />

            <div className="rounded-[34px] border border-slate-200 bg-white/90 p-4 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.3)] backdrop-blur">
              <div className="rounded-[28px] bg-[linear-gradient(140deg,#0f172a_0%,#1d4ed8_58%,#f97316_100%)] p-5 text-white">
                <div className="mb-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-orange-200">
                    Student View
                  </p>
                  <h2 className="mt-3 text-3xl leading-tight text-white">
                    Search, prepare, and track in one steady flow
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1.08fr_0.92fr]">
                  <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/10">
                    <img
                      alt="Students collaborating on attachment preparation"
                      className="h-full min-h-[280px] w-full object-cover"
                      src={heroImage}
                    />
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-[24px] border border-white/10 bg-white/10 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-orange-200">
                        Universities
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-100">
                        UZ, NUST, MSU, CUT, HIT and more
                      </p>
                    </div>

                    <div className="rounded-[24px] border border-white/10 bg-white/10 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-orange-200">
                        Application Flow
                      </p>
                      <div className="mt-3 grid gap-2">
                        {applicationStates.map((state) => (
                          <div
                            className="flex items-center justify-between rounded-2xl bg-white/8 px-3 py-2"
                            key={state.label}
                          >
                            <span className="text-sm text-slate-100">{state.label}</span>
                            <span className={`h-2.5 w-2.5 rounded-full ${state.tone}`} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-white/10 bg-white/10 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-orange-200">
                        Readiness
                      </p>
                      <div className="mt-3 grid gap-3">
                        {progressItems.map((item) => (
                          <div key={item.label}>
                            <div className="mb-2 flex items-center justify-between text-xs text-slate-100">
                              <span>{item.label}</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/15">
                              <div className={`h-2 rounded-full ${item.tone} ${item.width}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
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
              Whether you study in Harare, Bulawayo, Gweru, Mutare, or elsewhere, the experience should still feel relevant to your journey.
            </h2>
            <p className="text-base leading-8 text-slate-300 sm:text-lg">
              This platform is designed for students from universities across Zimbabwe who
              need a clearer way to prepare for industrial attachment and stay organized as
              they move through the application process.
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
              <p className="text-sm uppercase tracking-[0.24em] text-orange-300">University Reach</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {universities.map((item) => (
                  <div
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100"
                    key={item}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_0.78fr]">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
                <img
                  alt="Students preparing together for industrial attachment"
                  className="h-full min-h-[250px] w-full object-cover"
                  src={heroImage}
                />
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-orange-300">
                  Student Snapshot
                </p>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl bg-white/8 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                      Program
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-100">
                      Business Systems, Computing, Information Systems, Engineering and more
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/8 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                      Readiness
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-100">
                      One place to keep your search, progress, and next actions visible
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/8 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                      Direction
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-100">
                      Better structure from the first application to the final response
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
                Serving students from universities across Zimbabwe with one consistent experience.
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
                <Link
                  className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                  to="/register"
                >
                  Create Account
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  to="/login"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
