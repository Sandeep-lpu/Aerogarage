import { cn } from "../../utils/cn";

export default function Select({ label, error, className, children, ...props }) {
  return (
    <label className="grid gap-2">
      {label ? <span className="text-sm font-medium text-[var(--amc-text-strong)]">{label}</span> : null}
      <select
        className={cn(
          "h-11 rounded-[var(--amc-radius-md)] border border-[var(--amc-border)] bg-white px-3 text-sm text-[var(--amc-text-strong)] outline-none transition duration-[var(--amc-dur-fast)] ease-[var(--amc-ease-standard)] focus:border-[var(--amc-accent-500)] focus:ring-2 focus:ring-[var(--amc-accent-400)]/25",
          error ? "border-rose-500" : "",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}
