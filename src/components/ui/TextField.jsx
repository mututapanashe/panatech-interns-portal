import { createElement } from "react";
import { cn } from "../../utils/cn";

function TextField({ as = "input", className = "", ...props }) {
  return createElement(as, {
    className: cn(
      "w-full rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
      className,
    ),
    ...props,
  });
}

export default TextField;
