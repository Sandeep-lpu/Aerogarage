import { useState } from "react";
import Link from "../../app/router/Link";
import { cn } from "../../utils/cn";

const BRAND_LOGO_SRC = "/images/brand/finalLogo.png";

export default function BrandLogo({ to = "/", dark = false, className }) {
  const [failed, setFailed] = useState(false);

  return (
    <Link
      to={to}
      aria-label="Aerogarage home"
      className={cn("inline-flex items-center group", className)}
    >
      {!failed ? (
        <div className="flex items-center gap-3 md:gap-4 transition-transform duration-300 hover:opacity-95">
          <img
            src={BRAND_LOGO_SRC}
            alt="Aerogarage Logo"
            className={cn(
              "h-12 w-auto object-contain md:h-16 transition-all duration-300",
              dark ? "drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)] brightness-110" : "drop-shadow-sm",
            )}
            loading="eager"
            decoding="async"
            onError={() => setFailed(true)}
          />
          <span 
            className={cn(
              "text-xl md:text-2xl uppercase tracking-wider font-(--amc-font-heading) leading-none hidden sm:block",
              dark ? "text-white" : "text-transparent bg-clip-text bg-linear-to-r from-[#2ebf91] via-[#60a5fa] to-[#a78bfa]"
            )}
          >
            AEROGARAGE
          </span>
        </div>
      ) : (
        <span className={cn("text-lg font-bold tracking-wider uppercase", dark ? "text-white" : "text-(--amc-text-strong)")}>
          Aerogarage
        </span>
      )}
    </Link>
  );
}
