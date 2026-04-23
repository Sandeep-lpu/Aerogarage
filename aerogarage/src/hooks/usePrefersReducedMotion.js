// ── usePrefersReducedMotion Hook ───────────────────────────────────
// Reads the OS-level "prefers-reduced-motion" accessibility setting.
// Use this hook to disable or simplify animations for users who are sensitive
// to motion (e.g. those with vestibular disorders).
// The value updates live if the user changes their OS setting while the page is open.
// @returns {boolean} - true when the user prefers reduced motion
import { useEffect, useState } from "react";

export default function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Match the CSS media query for reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Read the current value and sync to state
    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference(); // Read initial value immediately
    mediaQuery.addEventListener("change", updatePreference); // Listen for live changes

    return () => {
      // Clean up listener to avoid memory leaks
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  return prefersReducedMotion;
}
