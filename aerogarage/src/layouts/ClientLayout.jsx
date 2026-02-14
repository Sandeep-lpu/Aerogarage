import Link from "../app/router/Link";

export default function ClientLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-bold">Client Portal</h1>
          <nav className="flex gap-4 text-sm font-medium">
            <Link to="/client/login" className="hover:text-blue-700">Login</Link>
            <Link to="/client/dashboard" className="hover:text-blue-700">Dashboard</Link>
            <Link to="/" className="hover:text-blue-700">Public Site</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
