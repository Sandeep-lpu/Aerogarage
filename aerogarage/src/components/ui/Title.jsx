import { cn } from "../../utils/cn";

export function Title({ as, className, children }) {
  const Component = as || "h2";
  return (
    <Component
      className={cn("font-[var(--amc-font-heading)] text-[var(--amc-text-strong)]", className)}
    >
      {children}
    </Component>
  );
}

export function Subtitle({ className, children }) {
  return (
    <p className={cn("text-sm uppercase tracking-[0.12em] text-[var(--amc-text-muted)]", className)}>
      {children}
    </p>
  );
}
