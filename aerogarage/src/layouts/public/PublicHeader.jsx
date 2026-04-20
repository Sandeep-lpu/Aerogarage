import { useState, useRef } from "react";
import Link from "../../app/router/Link";
import { useRouter } from "../../app/router/routerStore";
import { Button, ThemeToggle } from "../../components/ui";
import { cn } from "../../utils/cn";
import BrandLogo from "./BrandLogo";
import { mainNav, servicesMegaItems, aboutSubItems } from "./navConfig";

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

function DropdownMenu({ label, items, activePath }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);
  const isActive = items.some((i) => i.to === activePath);

  const handleOpen = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleClose = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      onFocus={handleOpen}
      onBlur={handleClose}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        className={cn(
          "flex items-center gap-1 text-sm font-medium transition-colors",
          isActive
            ? "text-[var(--amc-accent-600)]"
            : "text-[var(--amc-text-body)] hover:text-[var(--amc-accent-600)]",
        )}
        onClick={() => setOpen((prev) => !prev)}
      >
        {label}
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          className={cn("transition-transform duration-200", open ? "rotate-180" : "")}
          aria-hidden="true"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-[var(--amc-z-header)] pt-2">
          <div className="min-w-[14rem] rounded-[var(--amc-radius-lg)] border border-[var(--amc-border)] bg-[var(--amc-bg-surface)] p-2 shadow-[var(--amc-shadow-lg)]">
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col rounded-[var(--amc-radius-md)] px-3 py-2.5 transition hover:bg-[var(--amc-bg-main)]",
                  activePath === item.to && "bg-[var(--amc-bg-main)]"
                )}
              >
                <span className={cn(
                  "text-sm font-semibold",
                  activePath === item.to ? "text-[var(--amc-accent-600)]" : "text-[var(--amc-text-strong)]"
                )}>{item.title}</span>
                {item.description && (
                  <span className="mt-0.5 text-xs text-[var(--amc-text-muted)]">{item.description}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ServicesMegaMenu() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);

  const handleOpen = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleClose = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      onFocus={handleOpen}
      onBlur={handleClose}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        className="text-sm font-medium text-[var(--amc-text-body)] transition-colors hover:text-[var(--amc-accent-600)]"
        onClick={() => setOpen((prev) => !prev)}
      >
        Services
      </button>

      {open ? (
        <div className="absolute right-0 top-8 z-[var(--amc-z-header)] w-[32rem] rounded-[var(--amc-radius-lg)] border border-[var(--amc-border)] bg-[var(--amc-bg-surface)] p-4 shadow-[var(--amc-shadow-lg)]">
          <div className="grid gap-3 md:grid-cols-2">
            {servicesMegaItems.map((item) => (
              <Link
                key={item.title}
                to={item.to}
                className="rounded-[var(--amc-radius-md)] border border-[var(--amc-border)] p-3 transition hover:border-[var(--amc-accent-500)] hover:bg-[var(--amc-bg-main)]"
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
      className="sticky top-0 z-[var(--amc-z-header)] border-b border-[var(--amc-border)] bg-[var(--amc-bg-surface)] backdrop-blur"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setMobileOpen(false);
        }
      }}
    >
      <div className="amc-container flex h-[4.5rem] items-center justify-between">
        <BrandLogo />

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          <DropdownMenu label="About" items={aboutSubItems} activePath={path} />
          {mainNav.map((item) => (
            <NavItem key={item.to} to={item.to} label={item.label} activePath={path} />
          ))}
          <ServicesMegaMenu />
          <ThemeToggle />
          <Button as={Link} to="/client/login" size="sm">
            Client Portal
          </Button>
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="rounded-[var(--amc-radius-sm)] border border-[var(--amc-border)] bg-[var(--amc-bg-main)] px-3 py-2 text-sm font-medium text-[var(--amc-text-body)]"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation"
          >
            Menu
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div id="mobile-nav" className="border-t border-[var(--amc-border)] bg-[var(--amc-bg-surface)] lg:hidden" role="dialog" aria-label="Mobile navigation">
          <div className="amc-container grid gap-3 py-4">
            {/* About group */}
            {aboutSubItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={closeMobile}
                className={cn(
                  "rounded-[var(--amc-radius-sm)] px-2 py-2 text-sm font-medium",
                  path === item.to
                    ? "bg-[var(--amc-bg-main)] text-[var(--amc-accent-400)]"
                    : "text-[var(--amc-text-body)]",
                )}
              >
                {item.title}
              </Link>
            ))}
            {/* Services group */}
            {servicesMegaItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={closeMobile}
                className={cn(
                  "rounded-[var(--amc-radius-sm)] px-2 py-2 text-sm font-medium",
                  path === item.to
                    ? "bg-[var(--amc-bg-main)] text-[var(--amc-accent-400)]"
                    : "text-[var(--amc-text-body)]",
                )}
              >
                {item.title}
              </Link>
            ))}
            {/* Rest of nav */}
            {mainNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={closeMobile}
                className={cn(
                  "rounded-[var(--amc-radius-sm)] px-2 py-2 text-sm font-medium",
                  path === item.to
                    ? "bg-[var(--amc-bg-main)] text-[var(--amc-accent-400)]"
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
