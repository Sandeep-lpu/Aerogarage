import { useRouter } from "../app/router/routerStore";
import useSeo from "../seo/useSeo";
import PublicHeader from "./public/PublicHeader";
import PublicFooter from "./public/PublicFooter";
import StickyCtaBar from "./public/StickyCtaBar";

export default function PublicLayout({ children }) {
  const { path } = useRouter();
  useSeo(path);

  return (
    <div className="min-h-screen bg-[var(--amc-bg-main)] text-[var(--amc-text-body)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[var(--amc-z-toast)] focus:rounded-[var(--amc-radius-sm)] focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--amc-primary-900)]"
      >
        Skip to content
      </a>
      <PublicHeader />
      <main id="main-content" className="min-h-[calc(100vh-18rem)] pb-24 md:pb-0">
        {children}
      </main>
      <PublicFooter />
      <StickyCtaBar />
    </div>
  );
}
