import { cn } from "../../utils/cn";
import Button from "./Button";

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[var(--amc-z-modal)] grid place-items-center bg-[var(--amc-bg-overlay)] p-4">
      <div className={cn("w-full max-w-lg rounded-[var(--amc-radius-lg)] border border-[var(--amc-border)] bg-[var(--amc-bg-surface)] p-6 shadow-[var(--amc-shadow-lg)]")}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
