// ── useInView Hook ───────────────────────────────────────────────────
// Detects when a DOM element enters the viewport using the IntersectionObserver API.
// Fires only ONCE — once the element is visible, it stays visible and the observer
// disconnects to avoid unnecessary re-renders.
import { useEffect, useRef, useState } from "react";

// @param {IntersectionObserverInit} options - Observer options (default: 15% visibility threshold)
// @returns {[React.RefObject, boolean]} - [ref to attach to the element, inView boolean]
export default function useInView(options = { threshold: 0.15 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    // Skip if the element doesn't exist yet, or it's already been seen
    if (!ref.current || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // Disconnect after first intersection (one-shot)
        }
      },
      options,
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [inView, options]);

  return [ref, inView];
}
