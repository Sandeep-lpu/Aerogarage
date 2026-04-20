import Link from "../app/router/Link";
import { useAuth } from "../app/auth/authContext";
import { NotificationBell } from "../components/common/NotificationBell";
import { ThemeToggle } from "../components/ui";

export default function EmployeeLayout({ children }) {
  const { authState } = useAuth();
  
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-(--amc-bg-main) text-(--amc-text-body)">
      {/* Background Orbs – emerald/teal for Employee portal */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] h-[500px] w-[500px] rounded-full bg-emerald-600/10 blur-[100px]" />
        <div className="absolute -bottom-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-teal-600/10 blur-[100px]" />
      </div>

      <header className="relative z-20 border-b border-(--amc-border) bg-(--amc-bg-surface)/85 backdrop-blur-xl">
        <div className="flex h-[4.5rem] w-full items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <h1 className="text-xl font-bold tracking-wide text-(--amc-text-strong) uppercase">
              Aerogarage <span className="text-(--amc-text-muted) font-medium capitalize text-base ml-1">Employee Portal</span>
            </h1>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link to="/employee/login" className="text-(--amc-text-body) hover:text-(--amc-accent-600) transition-colors">Login</Link>
            <Link to="/employee/dashboard" className="text-(--amc-text-body) hover:text-(--amc-accent-600) transition-colors">Dashboard</Link>
            <div className="h-4 w-px bg-(--amc-border)" />
            <Link to="/" className="text-(--amc-text-body) hover:text-(--amc-accent-600) transition-colors flex items-center gap-1.5">
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
