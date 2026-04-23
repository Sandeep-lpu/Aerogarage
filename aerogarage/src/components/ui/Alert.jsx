import { cn } from "../../utils/cn";

const variants = {
  info: "border-[var(--amc-alert-info-border)] bg-[var(--amc-alert-info-bg)] text-[var(--amc-alert-info-text)]",
  success: "border-[var(--amc-alert-success-border)] bg-[var(--amc-alert-success-bg)] text-[var(--amc-alert-success-text)]",
  warning: "border-[var(--amc-alert-warning-border)] bg-[var(--amc-alert-warning-bg)] text-[var(--amc-alert-warning-text)]",
  danger: "border-[var(--amc-alert-danger-border)] bg-[var(--amc-alert-danger-bg)] text-[var(--amc-alert-danger-text)]",
};

export default function Alert({ variant = "info", title, children, className }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("rounded-[var(--amc-radius-md)] border p-4", variants[variant], className)}
    >
      {title ? <h4 className="text-sm font-semibold">{title}</h4> : null}
      {children ? <p className="mt-1 text-sm">{children}</p> : null}
    </div>
  );
}
