import { useState } from "react";
import Link from "../../app/router/Link";
import { useRouter } from "../../app/router/routerStore";
import { Button } from "../../components/ui";
import { cn } from "../../utils/cn";
import BrandLogo from "./BrandLogo";
import { mainNav, servicesMegaItems } from "./navConfig";

function NavItem({ to, label, activePath, onNavigate }) {
  const isActive = activePath === to;
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={cn(
        "text-sm font-medium transition-colors",
        isActive
          ? "text-[var(--amc-accent-600)]"
          : "text-[var(--amc-text-body)] hover:text-[var(--amc-accent-600)]",
      )}
    >
      {label}
    </Link>
  );
}

function ServicesMegaMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        className="text-sm font-medium text-[var(--amc-text-body)] transition-colors hover:text-[var(--amc-accent-600)]"
        onClick={() => setOpen((prev) => !prev)}
      >
        Service Areas
      </button>

      {open ? (
        <div className="absolute right-0 top-8 z-[var(--amc-z-header)] w-[32rem] rounded-[var(--amc-radius-lg)] border border-[var(--amc-border)] bg-[var(--amc-bg-surface)] p-4 shadow-[var(--amc-shadow-lg)]">
          <div className="grid gap-3 md:grid-cols-2">
            {servicesMegaItems.map((item) => (
              <Link
                key={item.title}
                to={item.to}
                className="rounded-[var(--amc-radius-md)] border border-[var(--amc-border)] p-3 transition hover:border-[var(--amc-accent-500)] hover:bg-slate-50"
              >
                <p className="text-sm font-semibold text-[var(--amc-text-strong)]">{item.title}</p>
                <p className="mt-1 text-xs text-[var(--amc-text-muted)]">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function PublicHeader() {
  const { path } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className="sticky top-0 z-[var(--amc-z-header)] border-b border-[var(--amc-border)] bg-white/95 backdrop-blur"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setMobileOpen(false);
        }
      }}
    >
      <div className="amc-container flex h-[4.5rem] items-center justify-between">
        <BrandLogo />

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {mainNav.map((item) => (
            <NavItem key={item.to} to={item.to} label={item.label} activePath={path} />
          ))}
          <ServicesMegaMenu />
          <Button as={Link} to="/client/login" size="sm">
            Client Portal
          </Button>
        </nav>

        <button
          type="button"
          className="rounded-[var(--amc-radius-sm)] border border-[var(--amc-border)] px-3 py-2 text-sm font-medium text-[var(--amc-text-body)] lg:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation"
        >
          Menu
        </button>
      </div>

      {mobileOpen ? (
        <div id="mobile-nav" className="border-t border-[var(--amc-border)] bg-white lg:hidden" role="dialog" aria-label="Mobile navigation">
          <div className="amc-container grid gap-3 py-4">
            {mainNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={closeMobile}
                className={cn(
                  "rounded-[var(--amc-radius-sm)] px-2 py-2 text-sm font-medium",
                  path === item.to
                    ? "bg-blue-50 text-[var(--amc-accent-600)]"
                    : "text-[var(--amc-text-body)]",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/client/login"
              onClick={closeMobile}
              className="mt-1 rounded-[var(--amc-radius-sm)] bg-[var(--amc-accent-600)] px-3 py-2 text-center text-sm font-semibold text-white"
            >
              Client Portal
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
