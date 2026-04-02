import { AdjustmentsHorizontalIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import FormField from "../ui/FormField";
import TextField from "../ui/TextField";

function FilterPanel({ filters, options, isOpen, onChange, onReset, onToggle }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white/92 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.18)]">
      <div className="flex items-center justify-between gap-4 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-[1.1rem] bg-slate-950 text-white">
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Filters
            </p>
            <p className="mt-1 text-sm leading-7 text-slate-600">
              Narrow vacancies by category, location, skills, and type.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button className="hidden sm:inline-flex" onClick={onReset} size="sm" variant="ghost">
            Reset
          </Button>
          <button
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-orange-200 hover:text-orange-600 lg:hidden"
            onClick={onToggle}
            type="button"
          >
            <ChevronDownIcon className={`h-5 w-5 transition ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      <div className={`${isOpen ? "block" : "hidden"} border-t border-slate-200 p-4 sm:p-5 lg:block`}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FormField htmlFor="filter-category" label="Program / Category">
            <TextField
              as="select"
              id="filter-category"
              onChange={(event) => onChange("category", event.target.value)}
              value={filters.category}
            >
              <option value="">All categories</option>
              {options.categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </TextField>
          </FormField>

          <FormField htmlFor="filter-location" label="Location">
            <TextField
              as="select"
              id="filter-location"
              onChange={(event) => onChange("location", event.target.value)}
              value={filters.location}
            >
              <option value="">All locations</option>
              {options.locations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </TextField>
          </FormField>

          <FormField htmlFor="filter-skill" label="Skills (optional)">
            <TextField
              as="select"
              id="filter-skill"
              onChange={(event) => onChange("skill", event.target.value)}
              value={filters.skill}
            >
              <option value="">All skills</option>
              {options.skills.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </TextField>
          </FormField>

          <FormField htmlFor="filter-type" label="Vacancy Type (optional)">
            <TextField
              as="select"
              id="filter-type"
              onChange={(event) => onChange("type", event.target.value)}
              value={filters.type}
            >
              <option value="">All types</option>
              {options.types.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </TextField>
          </FormField>
        </div>

        <div className="mt-4 sm:hidden">
          <Button onClick={onReset} size="sm" variant="ghost">
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;
