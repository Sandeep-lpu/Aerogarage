import { useCallback, useEffect, useMemo, useState } from "react";
import { RouterContext } from "./routerStore";

export default function RouterProvider({ children }) {
  const [path, setPath] = useState(window.location.pathname || "/");

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname || "/");
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback(
    (to) => {
      if (!to || to === path) return;
      window.history.pushState({}, "", to);
      setPath(to);
    },
    [path],
  );

  const value = useMemo(() => ({ path, navigate }), [path, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}
