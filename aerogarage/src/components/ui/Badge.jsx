import { cn } from "../../utils/cn";

const variants = {
  neutral: "bg-[var(--amc-badge-neutral-bg)] text-[var(--amc-badge-neutral-text)]",
  info: "bg-[var(--amc-badge-info-bg)] text-[var(--amc-badge-info-text)]",
  success: "bg-[var(--amc-badge-success-bg)] text-[var(--amc-badge-success-text)]",
  warning: "bg-[var(--amc-badge-warning-bg)] text-[var(--amc-badge-warning-text)]",
  danger: "bg-[var(--amc-badge-danger-bg)] text-[var(--amc-badge-danger-text)]",
};

export default function Badge({ variant = "neutral", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
