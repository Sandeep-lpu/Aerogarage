import Link from "../../app/router/Link";

export default function PublicFooter() {
  return (
    <footer className="border-t border-[var(--amc-border)] bg-[var(--amc-primary-900)] text-slate-200">
      <div className="amc-container grid gap-8 py-12 md:grid-cols-4">
        <div>
          <p className="text-lg font-semibold text-white">Aerogarage Company</p>
          <p className="mt-3 text-sm text-slate-300">
            Safety-driven aviation services partner aligned with Saudi Vision 2030.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-400">Company</p>
          <div className="mt-3 grid gap-2 text-sm">
            <Link to="/about" className="hover:text-white">About</Link>
            <Link to="/services" className="hover:text-white">Services</Link>
            <Link to="/training" className="hover:text-white">Training</Link>
            <Link to="/careers" className="hover:text-white">Careers</Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-400">Portals</p>
          <div className="mt-3 grid gap-2 text-sm">
            <Link to="/client/login" className="hover:text-white">Client Portal</Link>
            <Link to="/training/login" className="hover:text-white">Training Portal</Link>
            <Link to="/admin/login" className="hover:text-white">Admin System</Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-400">Contact</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-300">
            <a href="mailto:sales@aeroamc.com" className="hover:text-white">sales@aeroamc.com</a>
            <a href="mailto:careers@aeroamc.com" className="hover:text-white">careers@aeroamc.com</a>
            <a href="mailto:contact@aeroamc.com" className="hover:text-white">contact@aeroamc.com</a>
            <a href="tel:+966580722815" className="hover:text-white">+966 580 722 815</a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="amc-container flex flex-col gap-2 py-4 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Aerogarage Company. All rights reserved.</p>
          <p>Riyadh, Kingdom of Saudi Arabia</p>
        </div>
      </div>
    </footer>
  );
}
