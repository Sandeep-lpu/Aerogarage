import { cn } from "../../utils/cn";

const variants = {
  primary:
    "bg-[var(--amc-accent-600)] text-white border border-transparent hover:bg-[var(--amc-accent-500)] focus-visible:outline-[var(--amc-accent-400)]",
  secondary:
    "bg-transparent text-[var(--amc-primary-900)] border border-[var(--amc-border)] hover:bg-[var(--amc-steel-50)] focus-visible:outline-[var(--amc-accent-400)]",
  ghost:
    "bg-transparent text-[var(--amc-primary-900)] border border-transparent hover:bg-[var(--amc-steel-50)] focus-visible:outline-[var(--amc-accent-400)]",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export default function Button({
  as,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) {
  const Component = as || "button";
  const buttonProps = Component === "button" ? { type: "button", ...props } : props;

  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--amc-radius-md)] font-semibold transition-all duration-[var(--amc-dur-base)] ease-[var(--amc-ease-standard)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        variants[variant],
        sizes[size],
        className,
      )}
      {...buttonProps}
    >
      {children}
    </Component>
  );
}
