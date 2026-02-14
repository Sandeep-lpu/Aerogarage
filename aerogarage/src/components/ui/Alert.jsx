import { cn } from "../../utils/cn";

const variants = {
  info: "border-blue-200 bg-blue-50 text-blue-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  danger: "border-rose-200 bg-rose-50 text-rose-800",
};

export default function Alert({ variant = "info", title, children, className }) {
  return (
    <div className={cn("rounded-[var(--amc-radius-md)] border p-4", variants[variant], className)}>
      {title ? <h4 className="text-sm font-semibold">{title}</h4> : null}
      {children ? <p className="mt-1 text-sm">{children}</p> : null}
    </div>
  );
}
