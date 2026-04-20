import { cn } from "../../utils/cn";

export default function TextBlock({ className, children }) {
  return <p className={cn("text-base leading-7 text-[var(--amc-text-body)]", className)}>{children}</p>;
}
