import { useEffect } from "react";
import { applySeo } from "./applySeo";

export default function useSeo(path) {
  useEffect(() => {
    applySeo(path);
  }, [path]);
}
