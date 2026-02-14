import Link from "../app/router/Link";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-bold text-slate-900">Aerogarage</Link>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link to="/about" className="hover:text-blue-700">About</Link>
            <Link to="/services" className="hover:text-blue-700">Services</Link>
            <Link to="/contact" className="hover:text-blue-700">Contact</Link>
            <Link to="/client/login" className="rounded bg-blue-700 px-3 py-1 text-white">Client Portal</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
