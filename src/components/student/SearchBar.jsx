import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

function SearchBar({ value, onChange, onClear, resultCount = 0 }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white/92 p-4 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.18)] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-[22px] border border-slate-200 bg-slate-50 py-4 pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            onChange={(event) => onChange(event.target.value)}
            placeholder="Search for companies, roles, or skills"
            type="text"
            value={value}
          />
          {value && (
            <button
              className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              onClick={onClear}
              type="button"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
          {resultCount} opportunities
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
