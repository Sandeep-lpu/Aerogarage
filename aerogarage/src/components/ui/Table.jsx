import { cn } from "../../utils/cn";

export default function Table({ columns = [], data = [], className }) {
  return (
    <div className={cn("overflow-x-auto rounded-[var(--amc-radius-lg)] border border-[var(--amc-border)]", className)}>
      <table className="min-w-full border-collapse bg-[var(--amc-bg-surface)] text-sm">
        <thead>
          <tr className="bg-[var(--amc-table-head)] text-left text-[var(--amc-text-strong)]">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-semibold">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-t border-[var(--amc-border)] hover:bg-[var(--amc-table-row-hover)]">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-[var(--amc-text-body)]">{row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
