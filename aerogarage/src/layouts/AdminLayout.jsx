import Link from "../app/router/Link";
import { useAuth } from "../app/auth/authContext";
import { NotificationBell } from "../components/common/NotificationBell";
import { ThemeToggle } from "../components/ui";

export default function AdminLayout({ children }) {
  const { authState } = useAuth();
  
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-(--amc-bg-main) text-(--amc-text-body) font-(--amc-font-body)">
      {/* Background Orbs for sleek lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute -bottom-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-emerald-600/10 blur-[100px]" />
      </div>

      <header className="relative z-20 border-b border-(--amc-border) bg-(--amc-bg-surface)/85 backdrop-blur-xl">
        <div className="flex h-[4.5rem] w-full items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h1 className="text-xl font-bold tracking-wide text-(--amc-text-strong) uppercase font-(--amc-font-heading)">
              Aerogarage <span className="text-(--amc-text-muted) font-medium capitalize text-base ml-1">Ops Center</span>
            </h1>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link to="/admin/dashboard" className="text-(--amc-text-body) hover:text-(--amc-accent-600) transition-colors">Dashboard</Link>
            <Link to="/" className="text-(--amc-text-body) hover:text-(--amc-accent-600) transition-colors flex items-center gap-1.5 focus:outline-none">
              Public Site
              <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </Link>
            <ThemeToggle />
            {authState?.isAuthenticated && (
              <div className="pl-6 border-l border-(--amc-border)">
                <NotificationBell />
              </div>
            )}
          </nav>
        </div>
      </header>
      <main className="relative z-10 flex flex-1 overflow-hidden">{children}</main>
    </div>
  );
}

