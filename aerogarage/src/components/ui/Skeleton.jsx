/**
 * Skeleton — animated shimmer placeholder for loading states.
 *
 * Usage:
 *   <Skeleton className="h-6 w-48 rounded" />
 *   <Skeleton variant="circle" className="h-10 w-10" />
 *   <Skeleton variant="text" lines={3} />
 */
export default function Skeleton({ className = "", variant = "rect", lines = 1 }) {
  if (variant === "text") {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            // Last text line is shorter for realistic multi-line look
            className={`amc-skeleton h-4 rounded ${i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"}`}
          />
        ))}
      </div>
    );
  }

  if (variant === "circle") {
    return <div className={`amc-skeleton rounded-full ${className}`} />;
  }

  // Default: rect
  return <div className={`amc-skeleton rounded ${className}`} />;
}

/**
 * SkeletonCard — pre-built card skeleton for dashboard list rows.
 */
export function SkeletonCard() {
  return (
    <div className="rounded-(--amc-radius-lg) border border-(--amc-border) bg-(--amc-bg-surface) p-5">
      <div className="flex items-start gap-4">
        <Skeleton variant="circle" className="h-10 w-10 shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-2 h-3 w-full" />
          <Skeleton className="mt-1 h-3 w-3/4" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

/**
 * DashboardSkeleton — full-page skeleton for lazy-loaded portal dashboards.
 */
export function DashboardSkeleton({ rows = 4, title = "Loading" }) {
  return (
    <div className="px-6 py-10 md:px-10">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="mt-2 h-4 w-80" />
      </div>

      {/* Stats strip */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-(--amc-radius-lg) border border-(--amc-border) bg-(--amc-bg-surface) p-4"
          >
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-3 h-7 w-12" />
          </div>
        ))}
      </div>

      {/* List rows */}
      <div className="flex flex-col gap-3">
        <span className="sr-only">{title}…</span>
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
