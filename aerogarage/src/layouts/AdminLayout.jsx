import Link from "../app/router/Link";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-bold">Admin System</h1>
          <nav className="flex gap-4 text-sm font-medium">
            <Link to="/admin/login" className="hover:text-cyan-300">Login</Link>
            <Link to="/admin/dashboard" className="hover:text-cyan-300">Dashboard</Link>
            <Link to="/" className="hover:text-cyan-300">Public Site</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
