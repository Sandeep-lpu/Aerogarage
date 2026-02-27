import { useState } from "react";
import Link from "../../app/router/Link";
import { cn } from "../../utils/cn";

const BRAND_LOGO_SRC = "/images/brand/amc-logo.png";

export default function BrandLogo({ to = "/", dark = false, className }) {
  const [failed, setFailed] = useState(false);

  return (
    <Link
      to={to}
      aria-label="Aerogarage home"
      className={cn("inline-flex items-center", className)}
    >
      {!failed ? (
        <img
          src={BRAND_LOGO_SRC}
          alt="Aerogarage Maintenance and Operations Company"
          className={cn(
            "h-9 w-auto object-contain md:h-10",
            dark ? "rounded-md bg-white/95 px-2 py-1" : "",
          )}
          loading="eager"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className={cn("text-lg font-bold", dark ? "text-white" : "text-[var(--amc-primary-900)]")}>
          Aerogarage
        </span>
      )}
    </Link>
  );
}
