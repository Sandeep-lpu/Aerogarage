import { cn } from "../../utils/cn";

export default function Container({ className, children }) {
  return <div className={cn("amc-container", className)}>{children}</div>;
}
