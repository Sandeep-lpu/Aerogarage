import Link from "../../app/router/Link";
import { Button } from "../../components/ui";

export default function StickyCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[var(--amc-z-header)] border-t border-[var(--amc-border)] bg-white/95 px-3 py-3 shadow-[var(--amc-shadow-lg)] backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-2">
        <Button as={Link} to="/contact" className="flex-1" size="sm">
          Request Proposal
        </Button>
        <Button as={Link} to="/services" variant="secondary" className="flex-1" size="sm">
          Services
        </Button>
      </div>
    </div>
  );
}
