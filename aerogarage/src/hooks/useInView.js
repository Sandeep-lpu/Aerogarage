import { useEffect, useRef, useState } from "react";

export default function useInView(options = { threshold: 0.15 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      options,
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [inView, options]);

  return [ref, inView];
}
