import Link from "../../../app/router/Link";
import { Button } from "../../../components/ui";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
      {/* Decorative heading */}
      <p className="text-8xl font-extrabold tracking-tight text-(--amc-accent) opacity-20 select-none">
        404
      </p>

      <h1 className="mt-4 text-3xl font-bold text-(--amc-text-strong) md:text-4xl">
        Page Not Found
      </h1>

      <p className="mt-4 max-w-md text-(--amc-text-muted)">
        The page you&apos;re looking for doesn&apos;t exist, was moved, or the
        link may be broken. Double-check the URL or head back to the homepage.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button as={Link} to="/">
          Back to Home
        </Button>
        <Button as={Link} to="/services" variant="secondary">
          View Our Services
        </Button>
        <Button as={Link} to="/contact" variant="secondary">
          Contact Us
        </Button>
      </div>

      {/* Subtle decorative line */}
      <div className="mt-16 h-px w-24 bg-(--amc-border)" />
      <p className="mt-4 text-xs text-(--amc-text-muted) opacity-60">
        Aerogarage · Aviation Ground Services
      </p>
    </main>
  );
}
