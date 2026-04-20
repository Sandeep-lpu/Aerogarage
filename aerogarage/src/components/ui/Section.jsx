import Container from "./Container";
import { cn } from "../../utils/cn";

export default function Section({
  className,
  containerClassName,
  title,
  subtitle,
  children,
  islandHeader = false,
  ...props
}) {
  return (
    <section className={cn("py-16 md:py-20", className)} {...props}>
      <Container className={containerClassName}>
        {(title || subtitle) && (
          <header className={cn("mb-8", islandHeader ? "inline-block p-6 rounded-2xl bg-[var(--amc-glass-bg)] backdrop-blur-xl border border-[var(--amc-border)] shadow-[var(--amc-shadow-md)] max-w-4xl" : "max-w-4xl")}>
            {title ? <h2 className={cn("text-3xl md:text-4xl", islandHeader && "text-[var(--amc-text-strong)]")}>{title}</h2> : null}
            {subtitle ? <p className={cn("mt-3", islandHeader ? "text-[var(--amc-text-body)]" : "text-[var(--amc-text-muted)]")}>{subtitle}</p> : null}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
