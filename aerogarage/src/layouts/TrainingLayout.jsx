import Link from "../app/router/Link";

export default function TrainingLayout({ children }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b bg-slate-900 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-bold">Training Portal</h1>
          <nav className="flex gap-4 text-sm font-medium">
            <Link to="/training/login" className="hover:text-blue-300">Login</Link>
            <Link to="/training/dashboard" className="hover:text-blue-300">Dashboard</Link>
            <Link to="/" className="hover:text-blue-300">Public Site</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
