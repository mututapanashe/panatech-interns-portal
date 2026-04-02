function AdminTable({ columns, rows }) {
  const renderCell = (column, row) => {
    if (typeof column.render === "function") {
      return column.render(row[column.key], row);
    }
    return row[column.key];
  };

  return (
    <>
      <div className="hidden overflow-hidden rounded-[28px] border border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.96)_100%)] shadow-[0_24px_70px_-44px_rgba(15,23,42,0.2)] ring-1 ring-white/70 md:block">
        <table className="min-w-full border-separate border-spacing-0 bg-transparent">
          <thead className="bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)]">
            <tr>
              {columns.map((column) => (
                <th
                  className="border-b border-r border-slate-200 px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 last:border-r-0"
                  key={column.key}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <tr
                  className={`transition hover:bg-slate-50/75 ${
                    index % 2 === 0 ? "bg-white/80" : "bg-slate-50/55"
                  }`}
                  key={row.id}
                >
                  {columns.map((column) => (
                    <td
                      className="border-b border-r border-slate-200 px-5 py-4 text-sm leading-7 text-slate-600 first:font-medium first:text-slate-900 last:border-r-0"
                      key={column.key}
                    >
                      {renderCell(column, row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-5 py-8 text-sm text-slate-500" colSpan={columns.length}>
                  No records available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {rows.length > 0 ? (
          rows.map((row) => (
            <article
              className="overflow-hidden rounded-[24px] border border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.96)_100%)] p-4 shadow-[0_18px_48px_-38px_rgba(15,23,42,0.18)] ring-1 ring-white/70"
              key={row.id}
            >
              {columns.map((column, index) => (
                <div
                  className={`mt-2 pt-2 first:mt-0 first:pt-0 ${
                    index === 0 ? "" : "border-t border-slate-100/90"
                  }`}
                  key={column.key}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {column.label}
                  </p>
                  <div className="mt-1 text-sm leading-7 text-slate-700">{renderCell(column, row)}</div>
                </div>
              ))}
            </article>
          ))
        ) : (
          <p className="rounded-[24px] border border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.96)_100%)] p-4 text-sm text-slate-500 shadow-[0_18px_48px_-38px_rgba(15,23,42,0.18)] ring-1 ring-white/70">
            No records available.
          </p>
        )}
      </div>
    </>
  );
}

export default AdminTable;
