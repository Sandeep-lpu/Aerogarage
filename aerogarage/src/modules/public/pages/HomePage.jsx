import { useEffect, useRef, useState } from "react";
import Link from "../../../app/router/Link";
import { Canvas } from '@react-three/fiber';
import { Badge, Button, Card, Container, Section, TextBlock, Title } from "../../../components/ui";
import InteractiveGlobe from "../components/InteractiveGlobe";
const HERO_SLIDES = [
  "/images/home/home-hero.webp",
  "/images/home/home-stats.webp",
  "/images/home/home-partnership.webp",
  "/images/home/home-services.webp",
];

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
    image: "/images/services/aircraft-cleaning.png",
    mostRequested: true,
  },
  {
    title: "Line Maintenance",
    benefit: "24/7 technical readiness through routine checks, defect support, and AOG response.",
    href: "/services/line-maintenance",
    image: "/images/public-pages/services-bg.webp",
    mostRequested: true,
  },
  {
    title: "PBB Operations",
    benefit: "Higher bridge uptime through disciplined operations and preventive maintenance workflows.",
    href: "/services/pbb-operations-maintenance",
    image: "/images/services/pbb-operations.png",
  },
  {
    title: "Surface Transportation",
    benefit: "Safe, compliant airside movement for crew, baggage, and operational support teams.",
    href: "/services/surface-transportation",
    image: "/images/services/surface-transportation.png",
  },
  {
    title: "Aircraft Security",
    benefit: "Controlled access, cabin search, and ramp-level security aligned to airline standards.",
    href: "/services/aircraft-security",
    image: "/images/services/aircraft-security.png",
  },
  {
    title: "Training Organization",
    benefit: "EASA Part-66 B1.1/B2 capability pipeline with structured practical and exam readiness.",
    href: "/training",
    image: "/images/services/training-organization.png",
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
    logoSrc: "/images/partners/royal-jordanian-air-academy-logo.svg",
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
    <Card className="amc-glass-card amc-stat-card">
      <p className="text-sm text-[var(--amc-text-muted)]">{label}</p>
      <p className="amc-stat-value mt-3 font-[var(--amc-font-heading)] text-3xl">
        {display}
        {suffix}
      </p>
    </Card>
  );
}

export default function HomePage() {
  const [statsRef, statsVisible] = useReveal();
  const [partnershipsRef, partnershipsVisible] = useReveal();
  const [complianceRef, complianceVisible] = useReveal();
  const [servicesRef, servicesVisible] = useReveal();
  const [trainingRef, trainingVisible] = useReveal();
  const [ctaRef, ctaVisible] = useReveal();

  return (
    <>
      <section className="amc-hero min-h-[90vh] flex items-center amc-hero-animated-bg">
        {/* Hero Video Background */}
        <video
          className="amc-hero-video-bg"
          src="/videos/hero-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HERO_SLIDES[0]}
          aria-hidden="true"
        />
        <div className="absolute inset-0 z-0 opacity-80 pointer-events-none mix-blend-screen">
            <Canvas camera={{ position: [0, 0, 8.5], fov: 40 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} />
                <InteractiveGlobe />
            </Canvas>
        </div>
        <div className="amc-hero-bg-overlay pointer-events-none" aria-hidden="true" />
        <div className="amc-hero-accent amc-hero-accent-a pointer-events-none" />
        <div className="amc-hero-accent amc-hero-accent-b pointer-events-none" />
        <Container className="relative z-10">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--amc-text-muted)]">Riyadh, Saudi Arabia</p>
              <Title as="h1" className="amc-hero-title mt-4 max-w-4xl text-4xl text-[var(--amc-text-strong)] md:text-6xl">
                National-Grade Aviation Services Built for Safety, Reliability, and Scale
              </Title>
              <TextBlock className="amc-hero-subtitle mt-5 max-w-2xl text-[var(--amc-text-body)]">
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
        className="amc-home-scroll-bg amc-home-bg-stats"
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
        className="amc-home-scroll-bg amc-home-bg-partnership"
        title="Partnership and Trust Network"
        subtitle="Strategic collaboration ecosystem supporting institutional-scale aviation delivery."
        islandHeader={true}
      >
        <div className="mb-10 flex justify-center max-w-5xl mx-auto px-4 amc-fade-in">
          <img src="/images/partners/Subsidiaries and Airports.png" alt="Subsidiaries and Airports Network Map" className="w-full h-auto rounded-xl shadow-2xl border border-white/10" loading="lazy" />
        </div>
        <div
          ref={partnershipsRef}
          className={`amc-partner-strip ${partnershipsVisible ? "amc-reveal-in" : "amc-reveal-start"}`}
        >
          {partnerships.map((item) => (
            <article key={item.name} className={`amc-partner-pill amc-glass-card ${item.featured ? "amc-partner-pill-featured" : ""}`}>
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
        className="amc-home-scroll-bg amc-home-bg-compliance"
        title="Compliance and Audit Readiness"
        subtitle="Credibility cues designed for airline procurement, authority review, and internal governance teams."
        islandHeader={true}
      >
        <div
          ref={complianceRef}
          className={`grid gap-4 md:grid-cols-3 ${complianceVisible ? "amc-reveal-in" : "amc-reveal-start"}`}
        >
          {complianceCues.map((item) => (
            <Card key={item.title} className="bg-[var(--amc-bg-surface)]">
              <Badge variant="info">Audit-Ready</Badge>
              <h3 className="mt-3 text-2xl">{item.title}</h3>
              <TextBlock className="mt-3">{item.detail}</TextBlock>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        className="amc-home-scroll-bg amc-home-bg-services"
        title="Integrated Service Highlights"
        subtitle="Scan key service outcomes and move directly to the right capability page."
        islandHeader={true}
      >
        <div
          ref={servicesRef}
          className={`grid gap-4 md:gap-5 md:grid-cols-2 xl:grid-cols-3 ${servicesVisible ? "amc-reveal-in" : "amc-reveal-start"}`}
        >
          {serviceHighlights.map((item, index) => (
            <Card
              key={item.title}
              padding="none"
              className={`amc-service-card min-h-[280px] relative overflow-hidden group ${servicesVisible ? "amc-slide-up" : "opacity-0"}`}
              style={{ animationDelay: `${index * 90}ms` }}
            >
              {/* Background Image Layer */}
              <div 
                className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="absolute inset-0 z-0 amc-service-card-overlay transition-colors duration-500" />
              
              {/* Content Layer */}
              <div className="relative z-10 flex flex-col h-full p-5 lg:p-6">
                <div className="flex items-start justify-between gap-3 mb-6">
                  <Badge variant="info" className="bg-[var(--amc-bg-hover)] text-[var(--amc-accent-600)] border border-[var(--amc-border)] backdrop-blur-md shadow-sm">Operational Service</Badge>
                  {item.mostRequested ? <Badge variant="success" className="bg-emerald-500 border-none text-white shadow-lg shadow-emerald-500/20">Most Requested</Badge> : null}
                </div>
                <h3 className="text-2xl font-bold amc-service-card-title drop-shadow-sm mb-3">{item.title}</h3>
                <TextBlock className="amc-service-card-desc drop-shadow-none mb-6 flex-grow">{item.benefit}</TextBlock>
                <Button as={Link} to={item.href} variant="secondary" className="mt-auto w-full amc-service-card-btn transition-all hover:scale-[1.02]">
                  View Service
                </Button>
              </div>
            </Card>
          ))}
        </div>
        <div className="amc-service-cta-row mt-6 md:mt-7">
          <Button as={Link} to="/services" size="lg" className="amc-service-cta-btn">View All Services</Button>
          <Button as={Link} to="/contact" size="lg" variant="secondary" className="amc-service-cta-btn">Talk to Sales</Button>
        </div>
      </Section>

      <Section
        className="amc-home-scroll-bg amc-home-bg-training"
        title="Training and Capability Development"
        subtitle="A concise view of AMC training organization outcomes for workforce planning and engineering readiness."
        islandHeader={true}
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

      <Section className="amc-cta-band amc-home-scroll-bg amc-home-bg-cta">
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

    </>
  );
}

