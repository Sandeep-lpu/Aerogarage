import Link from "../../app/router/Link";
import BrandLogo from "./BrandLogo";

export default function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-[var(--amc-bg-navy)] text-slate-300">
      <div className="amc-container grid gap-8 py-12 md:grid-cols-4">
        <div>
          <BrandLogo dark className="w-fit" />
          <p className="mt-3 text-sm text-slate-400">
            Safety-driven aviation services partner aligned with Saudi Vision 2030.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-400">Company</p>
          <div className="mt-3 grid gap-2 text-sm">
            <Link to="/about" className="text-slate-300 hover:text-white transition-colors duration-200">About</Link>
            <Link to="/services" className="text-slate-300 hover:text-white transition-colors duration-200">Services</Link>
            <Link to="/training" className="text-slate-300 hover:text-white transition-colors duration-200">Training</Link>
            <Link to="/careers" className="text-slate-300 hover:text-white transition-colors duration-200">Careers</Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-400">Portals</p>
          <div className="mt-3 grid gap-2 text-sm">
            <Link to="/client/login" className="text-slate-300 hover:text-white transition-colors duration-200">Client Portal</Link>
            <Link to="/employee/login" className="text-slate-300 hover:text-white transition-colors duration-200">Employee Portal</Link>
            <Link to="/training/login" className="text-slate-300 hover:text-white transition-colors duration-200">Training Portal</Link>
            <Link to="/admin/login" className="text-slate-300 hover:text-white transition-colors duration-200">Admin System</Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-400">Contact</p>
          <div className="mt-3 grid gap-2 text-sm">
            <a href="mailto:sales@aeroamc.com" className="text-slate-300 hover:text-white transition-colors duration-200">sales@aeroamc.com</a>
            <a href="mailto:careers@aeroamc.com" className="text-slate-300 hover:text-white transition-colors duration-200">careers@aeroamc.com</a>
            <a href="mailto:contact@aeroamc.com" className="text-slate-300 hover:text-white transition-colors duration-200">contact@aeroamc.com</a>
            <a href="tel:+966580722815" className="text-slate-300 hover:text-white transition-colors duration-200">+966 580 722 815</a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="amc-container flex flex-col gap-2 py-4 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Aerogarage Company. All rights reserved.</p>
          <p>Riyadh, Kingdom of Saudi Arabia</p>
        </div>
      </div>
    </footer>
  );
}
