import { cn } from "../../utils/cn";

export default function Card({ className, children }) {
  return (
    <article
      className={cn(
        "rounded-[var(--amc-radius-lg)] border border-[var(--amc-border)] bg-[var(--amc-bg-surface)] p-6 md:p-8 shadow-[var(--amc-shadow-md)]",
        className,
      )}
    >
      {children}
    </article>
  );
}
