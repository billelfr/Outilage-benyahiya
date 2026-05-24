export function DataTable({ columns, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-line bg-slate-50/80 text-xs uppercase tracking-[0.12em] text-muted">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-5 py-4 font-bold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}
