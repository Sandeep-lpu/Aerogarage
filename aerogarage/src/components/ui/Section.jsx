import Container from "./Container";
import { cn } from "../../utils/cn";

export default function Section({
  className,
  containerClassName,
  title,
  subtitle,
  children,
  ...props
}) {
  return (
    <section className={cn("py-16 md:py-20", className)} {...props}>
      <Container className={containerClassName}>
        {(title || subtitle) && (
          <header className="mb-8">
            {title ? <h2 className="text-3xl md:text-4xl">{title}</h2> : null}
            {subtitle ? <p className="mt-3 max-w-3xl text-slate-600">{subtitle}</p> : null}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
