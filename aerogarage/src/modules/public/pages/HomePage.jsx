import { useEffect, useRef, useState } from "react";
import Link from "../../../app/router/Link";
import { Badge, Button, Card, Container, Section, TextBlock, Title } from "../../../components/ui";
import usePrefersReducedMotion from "../../../hooks/usePrefersReducedMotion";
import MediaStage from "../components/media/MediaStage";

const trustItems = [
  "Safety-first operations framework",
  "Vision 2030-aligned capability growth",
  "24/7 operational readiness",
  "Audit-ready service governance",
];

const serviceHighlights = [
  {
    title: "Aircraft Cleaning",
    summary: "Transit, turnaround, deep cleaning, and hygiene-controlled aircraft presentation services.",
  },
  {
    title: "Line Maintenance",
    summary: "Routine checks, unscheduled support, and AOG response aligned with safety-critical standards.",
  },
  {
    title: "PBB Operations",
    summary: "Bridge operation and maintenance protocols designed for uptime and passenger safety continuity.",
  },
  {
    title: "Training Organization",
    summary: "EASA Part-66 B1.1/B2 pathways with RJAA affiliation for long-term local talent development.",
  },
];

const stats = [
  { label: "Service Domains", value: 6, suffix: "+" },
  { label: "Operations Coverage", value: 24, suffix: "/7" },
  { label: "Strategic Focus", value: 2030, suffix: " Vision" },
  { label: "Founding Year", value: 2023, suffix: "" },
];

function useReveal(threshold = 0.18) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(() => typeof window !== "undefined" && !("IntersectionObserver" in window));

  useEffect(() => {
    if (!ref.current || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, visible]);

  return [ref, visible];
}

function StatCard({ label, value, suffix, visible }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!visible) return;

    let rafId = null;
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(progress * value));
      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [value, visible]);

  return (
    <Card className="bg-white/95">
      <p className="text-sm text-[var(--amc-text-muted)]">{label}</p>
      <p className="mt-3 font-[var(--amc-font-heading)] text-3xl text-[var(--amc-text-strong)]">
        {display}
        {suffix}
      </p>
    </Card>
  );
}

export default function HomePage() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [parallax, setParallax] = useState(0);
  const [statsRef, statsVisible] = useReveal();
  const [servicesRef, servicesVisible] = useReveal();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const onScroll = () => {
      const offset = Math.min(window.scrollY * 0.08, 64);
      setParallax(offset);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [prefersReducedMotion]);

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--amc-gradient-hero)] py-24 md:py-28">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl"
          style={{ transform: `translateY(${parallax}px)` }}
        />
        <div
          className="pointer-events-none absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-slate-100/10 blur-3xl"
          style={{ transform: `translateY(${-parallax * 0.65}px)` }}
        />

        <Container className="relative z-10">
          <Badge className="bg-blue-100/15 text-blue-100">Riyadh, Saudi Arabia</Badge>
          <Title as="h1" className="mt-5 max-w-4xl text-4xl text-white md:text-6xl">
            National-Grade Aviation Services Built for Safety, Reliability, and Scale
          </Title>
          <TextBlock className="mt-6 max-w-2xl text-blue-100">
            Aerogarage Company delivers precision operations across aircraft services, line maintenance, training, and airside support with institutional quality standards.
          </TextBlock>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button as={Link} to="/contact" size="lg">
              Request Corporate Proposal
            </Button>
            <Button
              as={Link}
              to="/services"
              size="lg"
              variant="secondary"
              className="border-white text-white hover:bg-white/10"
            >
              Explore Service Portfolio
            </Button>
          </div>

          <div className="mt-10 grid gap-3 md:grid-cols-4">
            {trustItems.map((item) => (
              <div
                key={item}
                className="rounded-[var(--amc-radius-md)] border border-white/15 bg-white/10 px-4 py-3 text-sm text-blue-100 backdrop-blur"
              >
                {item}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Section
        containerClassName="amc-fade-in"
        title="Operational Confidence at a Glance"
        subtitle="A quick credibility layer for procurement teams, airport authorities, and airline operations leaders."
      >
        <div ref={statsRef} className="grid gap-4 md:grid-cols-4">
          {stats.map((item) => (
            <StatCard
              key={item.label}
              label={item.label}
              value={item.value}
              suffix={item.suffix}
              visible={statsVisible}
            />
          ))}
        </div>
      </Section>

      <Section
        className="bg-[var(--amc-gradient-surface)]"
        title="Integrated Service Highlights"
        subtitle="Focused service lanes designed for airport continuity, airline readiness, and technical reliability."
      >
        <div ref={servicesRef} className="grid gap-6 md:grid-cols-2">
          {serviceHighlights.map((item, index) => (
            <Card
              key={item.title}
              className={servicesVisible ? "amc-slide-up" : "opacity-0"}
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <h3 className="text-2xl">{item.title}</h3>
              <TextBlock className="mt-3">{item.summary}</TextBlock>
              <Button as={Link} to="/services" variant="secondary" className="mt-5">
                View Service Scope
              </Button>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Engineering Precision, Presented with Clarity"
        subtitle="Controlled 3D enhancement layer optimized for performance with lazy loading and fallback support."
      >
        <MediaStage
          variant="hero"
          title="Hero Visual Intelligence Layer"
          description="This stage introduces premium but controlled visual depth. Full media assets and production 3D models can be integrated without changing section architecture."
        />
      </Section>
    </>
  );
}

