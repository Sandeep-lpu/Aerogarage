// ── cn (className) Utility ────────────────────────────────────────
// Merges multiple CSS class names into a single string, filtering out
// any falsy values (false, null, undefined, 0, "").
// Usage: cn('base-class', isActive && 'active', 'another-class')
// @param {...string} classes - Any number of class name strings or falsy values
// @returns {string} - Space-separated string of truthy class names
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
