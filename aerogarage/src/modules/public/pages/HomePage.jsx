import { Suspense, lazy, useEffect, useRef, useState } from "react";
import Link from "../../../app/router/Link";
import { Badge, Button, Card, Container, Section, TextBlock, Title } from "../../../components/ui";
import usePrefersReducedMotion from "../../../hooks/usePrefersReducedMotion";
const HomeMediaSection = lazy(() => import("../components/media/HomeMediaSection"));

const trustItems = [
  "Safety-first operations framework",
  "Vision 2030-aligned capability growth",
  "24/7 operational readiness",
  "Audit-ready service governance",
];

const serviceHighlights = [
  {
    title: "Aircraft Cleaning",
    benefit: "Faster turnaround with hygiene-controlled cabin and exterior presentation standards.",
    href: "/services/aircraft-cleaning",
    mostRequested: true,
  },
  {
    title: "Line Maintenance",
    benefit: "24/7 technical readiness through routine checks, defect support, and AOG response.",
    href: "/services/line-maintenance",
    mostRequested: true,
  },
  {
    title: "PBB Operations",
    benefit: "Higher bridge uptime through disciplined operations and preventive maintenance workflows.",
    href: "/services/pbb-operations-maintenance",
  },
  {
    title: "Surface Transportation",
    benefit: "Safe, compliant airside movement for crew, baggage, and operational support teams.",
    href: "/services/surface-transportation",
  },
  {
    title: "Aircraft Security",
    benefit: "Controlled access, cabin search, and ramp-level security aligned to airline standards.",
    href: "/services/aircraft-security",
  },
  {
    title: "Training Organization",
    benefit: "EASA Part-66 B1.1/B2 capability pipeline with structured practical and exam readiness.",
    href: "/training",
  },
];

const stats = [
  { label: "Service Domains", value: 6, suffix: "+" },
  { label: "Operations Coverage", value: 24, suffix: "/7" },
  { label: "Strategic Focus", value: 2030, suffix: " Vision" },
  { label: "Founding Year", value: 2023, suffix: "" },
];

const partnerships = [
  {
    name: "Royal Jordanian Air Academy",
    subtitle: "Training Partner (EASA Part-66)",
    logoSrc: "/images/partners/rjaa-logo.svg",
    logoAlt: "Royal Jordanian Air Academy logo",
    featured: true,
  },
  {
    name: "Airline Operations Partners",
    subtitle: "Operational Collaboration",
  },
  {
    name: "Airport Infrastructure Teams",
    subtitle: "Airside Support Integration",
  },
  {
    name: "MRO and Technical Alliances",
    subtitle: "Maintenance Capability Network",
  },
];

const complianceCues = [
  {
    title: "Regulatory Discipline",
    detail: "Operational procedures are structured for compliance-aligned execution and audit traceability.",
  },
  {
    title: "Quality Governance",
    detail: "Service delivery follows standardized checklists, escalation paths, and controlled quality gates.",
  },
  {
    title: "Safety Assurance",
    detail: "Safety-critical workflows are embedded into planning, execution, and post-operation review cycles.",
  },
];

const trainingCapability = [
  "EASA Part-66 B1.1 and B2 capability pathways with structured progression.",
  "RJAA-affiliated training approach combining theory, practical exposure, and exam readiness.",
  "Local talent pipeline aligned with Saudi Vision 2030 aviation growth priorities.",
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
  const [partnershipsRef, partnershipsVisible] = useReveal();
  const [complianceRef, complianceVisible] = useReveal();
  const [servicesRef, servicesVisible] = useReveal();
  const [trainingRef, trainingVisible] = useReveal();
  const [ctaRef, ctaVisible] = useReveal();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const onScroll = () => {
      const next = Math.min(window.scrollY * 0.08, 56);
      setParallax(next);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [prefersReducedMotion]);

  return (
    <>
      <section className="amc-hero">
        <div className="amc-hero-watermark" aria-hidden="true">Aerogarage</div>
        <div className="amc-hero-accent amc-hero-accent-a" style={{ transform: `translateY(${parallax}px)` }} />
        <div className="amc-hero-accent amc-hero-accent-b" style={{ transform: `translateY(${-parallax * 0.65}px)` }} />
        <Container className="relative z-10">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Riyadh, Saudi Arabia</p>
              <Title as="h1" className="mt-4 max-w-4xl text-4xl text-slate-900 md:text-6xl">
                National-Grade Aviation Services Built for Safety, Reliability, and Scale
              </Title>
              <TextBlock className="mt-5 max-w-2xl text-slate-600">
                Aerogarage Company delivers precision operations across aircraft services, line maintenance, training, and airside support with institutional quality standards.
              </TextBlock>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button as={Link} to="/contact" size="lg" className="amc-hero-primary">
                  Request Corporate Proposal
                </Button>
                <Button
                  as={Link}
                  to="/services"
                  size="lg"
                  variant="ghost"
                  className="amc-hero-ghost"
                >
                  Explore Service Portfolio
                </Button>
              </div>

              <div className="amc-hero-divider" aria-hidden="true" />

              <div className="amc-hero-trust">
                {trustItems.map((item) => (
                  <span key={item} className="amc-hero-trust-pill">{item}</span>
                ))}
              </div>
            </div>

            <div className="amc-fade-in" aria-hidden="true" />
          </div>
        </Container>
      </section>

      <Section
        containerClassName="amc-fade-in"
        title="Operational Confidence at a Glance"
        subtitle="A quick credibility layer for procurement teams, airport authorities, and airline operations leaders."
      >
        <div ref={statsRef} className={`grid gap-4 md:grid-cols-4 ${statsVisible ? "amc-reveal-in" : "amc-reveal-start"}`}>
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
        title="Partnership and Trust Network"
        subtitle="Strategic collaboration ecosystem supporting institutional-scale aviation delivery."
      >
        <div
          ref={partnershipsRef}
          className={`amc-partner-strip ${partnershipsVisible ? "amc-reveal-in" : "amc-reveal-start"}`}
        >
          {partnerships.map((item) => (
            <article key={item.name} className={`amc-partner-pill ${item.featured ? "amc-partner-pill-featured" : ""}`}>
              {item.logoSrc ? (
                <img className="amc-partner-logo" src={item.logoSrc} alt={item.logoAlt || item.name} loading="lazy" decoding="async" />
              ) : null}
              <div className="amc-partner-content">
                <p className="amc-partner-name">{item.name}</p>
                <p className="amc-partner-subtitle">{item.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="Compliance and Audit Readiness"
        subtitle="Credibility cues designed for airline procurement, authority review, and internal governance teams."
      >
        <div
          ref={complianceRef}
          className={`grid gap-4 md:grid-cols-3 ${complianceVisible ? "amc-reveal-in" : "amc-reveal-start"}`}
        >
          {complianceCues.map((item) => (
            <Card key={item.title} className="bg-white">
              <Badge variant="info">Audit-Ready</Badge>
              <h3 className="mt-3 text-2xl">{item.title}</h3>
              <TextBlock className="mt-3">{item.detail}</TextBlock>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        className="bg-[var(--amc-gradient-surface)]"
        title="Integrated Service Highlights"
        subtitle="Scan key service outcomes and move directly to the right capability page."
      >
        <div
          ref={servicesRef}
          className={`grid gap-4 md:gap-5 md:grid-cols-2 xl:grid-cols-3 ${servicesVisible ? "amc-reveal-in" : "amc-reveal-start"}`}
        >
          {serviceHighlights.map((item, index) => (
            <Card
              key={item.title}
              className={`amc-service-card min-h-[220px] ${servicesVisible ? "amc-slide-up" : "opacity-0"}`}
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="flex items-center justify-between gap-3">
                <Badge variant="info">Operational Service</Badge>
                {item.mostRequested ? <Badge variant="success">Most Requested</Badge> : null}
              </div>
              <h3 className="mt-3 text-2xl">{item.title}</h3>
              <TextBlock className="mt-3">{item.benefit}</TextBlock>
              <Button as={Link} to={item.href} variant="secondary" className="mt-auto w-full">
                View Service
              </Button>
            </Card>
          ))}
        </div>
        <div className="amc-service-cta-row mt-6 md:mt-7">
          <Button as={Link} to="/services" size="lg" className="amc-service-cta-btn">View All Services</Button>
          <Button as={Link} to="/contact" size="lg" variant="secondary" className="amc-service-cta-btn">Talk to Sales</Button>
        </div>
      </Section>

      <Section
        title="Training and Capability Development"
        subtitle="A concise view of AMC training organization outcomes for workforce planning and engineering readiness."
      >
        <div
          ref={trainingRef}
          className={`grid gap-5 md:gap-6 lg:grid-cols-[1.1fr_0.9fr] ${trainingVisible ? "amc-reveal-in" : "amc-reveal-start"}`}
        >
          <Card>
            <Badge variant="info">Capability Block</Badge>
            <h3 className="mt-3 text-2xl">Aircraft Engineer Training Organization</h3>
            <div className="mt-4 grid gap-3">
              {trainingCapability.map((item) => (
                <TextBlock key={item}>{item}</TextBlock>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button as={Link} to="/training">Explore Training Programs</Button>
            </div>
          </Card>
          <Card className="bg-[var(--amc-gradient-surface)]">
            <Badge variant="success">Institutional Impact</Badge>
            <h3 className="mt-3 text-2xl">Talent Pipeline for Saudi Aviation Scale</h3>
            <TextBlock className="mt-3">
              Programs are structured to support airlines, MROs, and airport operations teams with role-ready engineering capability.
            </TextBlock>
            <TextBlock className="mt-3">
              This strengthens operational continuity while reducing dependency on external technical staffing.
            </TextBlock>
          </Card>
        </div>
      </Section>

      <Section className="amc-cta-band">
        <div ref={ctaRef} className={`amc-cta-band-grid ${ctaVisible ? "amc-reveal-in" : "amc-reveal-start"}`}>
          <div>
            <Badge variant="info">Next Step</Badge>
            <h2 className="mt-3 text-3xl text-[var(--amc-text-strong)] md:text-4xl">
              Ready to Evaluate AMC for Your Aviation Operations?
            </h2>
            <TextBlock className="mt-3 max-w-2xl">
              Engage our team for service scope alignment, operational planning, and enterprise proposal support.
            </TextBlock>
          </div>
          <div className="amc-cta-band-actions">
            <Button as={Link} to="/contact" size="lg" className="amc-cta-band-primary">
              Request Corporate Proposal
            </Button>
            <Button as={Link} to="/services" size="lg" variant="secondary" className="amc-cta-band-secondary">
              Review Service Portfolio
            </Button>
          </div>
        </div>
      </Section>

      <Suspense fallback={null}>
        <HomeMediaSection />
      </Suspense>
    </>
  );
}
