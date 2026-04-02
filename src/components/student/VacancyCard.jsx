import {
  BookmarkIcon,
  CalendarDaysIcon,
  EyeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import Button from "../ui/Button";
import StatusBadge from "../ui/StatusBadge";
import { getVacancyApplicationMeta } from "../../utils/platformModels";

function trimDescription(value, maxLength = 170) {
  const text = String(value || "").trim();
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength).trim()}...`;
}

function VacancyCard({
  vacancy,
  alreadyApplied = false,
  isFeatured = false,
  isSaved = false,
  onApply,
  onSave,
  onViewDetails,
}) {
  const applicationMeta = getVacancyApplicationMeta(vacancy);

  return (
    <article
      className={`relative overflow-hidden rounded-[28px] border border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.98)_100%)] p-5 shadow-[0_24px_68px_-42px_rgba(15,23,42,0.18)] ring-1 ring-white/70 transition hover:-translate-y-0.5 hover:shadow-[0_30px_78px_-42px_rgba(15,23,42,0.22)] ${
        isFeatured ? "min-w-[300px] max-w-[320px] flex-shrink-0" : ""
      }`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(249,115,22,0)_0%,rgba(249,115,22,0.4)_35%,rgba(37,99,235,0.36)_70%,rgba(37,99,235,0)_100%)]" />
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {vacancy.match?.recommended && <StatusBadge tone="accepted">Recommended</StatusBadge>}
          <StatusBadge status={vacancy.status || "Open"}>{vacancy.status || "Open"}</StatusBadge>
          <StatusBadge tone={applicationMeta.badgeLabel}>
            {applicationMeta.badgeLabel}
          </StatusBadge>
          {vacancy.vacancyType && <StatusBadge>{vacancy.vacancyType}</StatusBadge>}
        </div>
        <button
          aria-label={isSaved ? "Unsave vacancy" : "Save vacancy"}
          className={`inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border transition ${
            isSaved
              ? "border-orange-200 bg-orange-50 text-orange-600"
              : "border-slate-200 bg-white text-slate-500 hover:border-orange-200 hover:text-orange-600"
          }`}
          onClick={onSave}
          type="button"
        >
          {isSaved ? <BookmarkSolidIcon className="h-5 w-5" /> : <BookmarkIcon className="h-5 w-5" />}
        </button>
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
          {vacancy.companyName || vacancy.company}
        </p>
        <h3 className="mt-3 text-2xl leading-snug text-slate-950">
          {vacancy.vacancyTitle || vacancy.position}
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          {trimDescription(vacancy.description, isFeatured ? 190 : 150)}
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[20px] border border-slate-200/80 bg-white/90 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Location
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-900">
            <MapPinIcon className="h-4 w-4 text-slate-400" />
            {vacancy.location || "Zimbabwe"}
          </p>
        </div>
        <div className="rounded-[20px] border border-slate-200/80 bg-white/90 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Deadline
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-900">
            <CalendarDaysIcon className="h-4 w-4 text-slate-400" />
            {vacancy.formattedDeadline || vacancy.deadlineLabel || vacancy.deadline || "Open"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {vacancy.category && <StatusBadge>{vacancy.category}</StatusBadge>}
        {(vacancy.requiredSkills || []).slice(0, 3).map((item) => (
          <StatusBadge key={item} tone="submitted">
            {item}
          </StatusBadge>
        ))}
      </div>

      {!!vacancy.match?.reasons?.length && (
        <div className="mt-4 flex flex-wrap gap-2">
          {vacancy.match.reasons.map((reason) => (
            <StatusBadge key={reason} tone="accepted">
              {reason}
            </StatusBadge>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button onClick={onViewDetails} variant="secondary">
          <EyeIcon className="h-4 w-4" />
          View Details
        </Button>
        <Button disabled={alreadyApplied} onClick={onApply}>
          {alreadyApplied ? "Applied" : applicationMeta.actionLabel}
        </Button>
      </div>
    </article>
  );
}

export default VacancyCard;
