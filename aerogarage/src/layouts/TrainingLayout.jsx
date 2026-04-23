import Link from "../app/router/Link";

export default function TrainingLayout({ children }) {
  return (
    <div data-theme="amc-dark" className="flex h-screen w-full flex-col overflow-hidden bg-slate-950 text-slate-300 font-[var(--amc-font-body)]">
      {/* Background Orbs for sleek cyan/blue lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] h-[500px] w-[500px] rounded-full bg-cyan-600/10 blur-[100px]" />
        <div className="absolute -bottom-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      <header className="relative z-20 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div className="flex h-[4.5rem] w-full items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
            </div>
            <h1 className="text-xl font-bold tracking-wide text-white uppercase font-[var(--amc-font-heading)]">
              Aerogarage <span className="text-slate-400 font-medium capitalize text-base ml-1">Learning Hub</span>
            </h1>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link to="/training/login" className="text-slate-300 hover:text-white transition-colors">Login</Link>
            <Link to="/training/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
            <div className="h-4 w-px bg-white/10" />
            <Link to="/" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none">
              Public Site
              <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </Link>
          </nav>
        </div>
      </header>
      <main className="relative z-10 flex flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
