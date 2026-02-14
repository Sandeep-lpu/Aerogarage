import { useState } from "react";
import { cn } from "../../utils/cn";

export default function Tabs({ items = [] }) {
  const [active, setActive] = useState(items[0]?.id);
  const activeItem = items.find((item) => item.id === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-[var(--amc-border)] pb-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={cn(
              "rounded-[var(--amc-radius-sm)] px-3 py-2 text-sm font-medium transition",
              active === item.id
                ? "bg-[var(--amc-accent-600)] text-white"
                : "text-[var(--amc-text-body)] hover:bg-slate-100",
            )}
            onClick={() => setActive(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="pt-4">{activeItem?.content}</div>
    </div>
  );
}
