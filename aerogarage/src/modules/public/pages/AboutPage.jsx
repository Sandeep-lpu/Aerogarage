import Link from "../../../app/router/Link";
import { Badge, Button, Card, Section, TextBlock, Title } from "../../../components/ui";

const proofPoints = [
  { label: "Established", value: "2023" },
  { label: "Service Domains", value: "6+" },
  { label: "Operational Readiness", value: "24/7" },
  { label: "Strategic Alignment", value: "Vision 2030" },
];

const valuePillars = [
  {
    title: "Safety-Led Delivery",
    detail: "Operational execution is planned around safety-critical controls and risk-managed workflows.",
  },
  {
    title: "Regulatory Reliability",
    detail: "Service models are structured for compliance readiness, documentation clarity, and audit response.",
  },
  {
    title: "Institutional Consistency",
    detail: "Airports and airlines receive repeatable outcomes through governance-backed delivery standards.",
  },
];

const milestones = [
  {
    year: "2023",
    title: "AMC Established in Riyadh",
    detail: "Aerogarage launched to close critical gaps in aviation support capabilities across the Kingdom.",
  },
  {
    year: "2024",
    title: "Operational Service Expansion",
    detail: "Portfolio scaled across cleaning, line maintenance, security, and airport infrastructure support.",
  },
  {
    year: "2025",
    title: "Training Organization Activation",
    detail: "RJAA collaboration path enabled EASA Part-66 capability development frameworks.",
  },
  {
    year: "2026",
    title: "Enterprise Maturity",
    detail: "Quality and governance systems matured for institutional procurement and long-term contracts.",
  },
];

const partnerships = [
  "Royal Jordanian Air Academy (RJAA)",
  "Airline operations collaboration partners",
  "Airport infrastructure and ground services network",
  "Technical capability and workforce development ecosystem",
];

const quickNav = [
  { id: "about-proof", label: "Proof Points" },
  { id: "about-pillars", label: "Strategic Pillars" },
  { id: "about-timeline", label: "Timeline" },
  { id: "about-partners", label: "Partnerships" },
];

export default function AboutPage() {
  return (
    <>
      <Section className="bg-[var(--amc-gradient-surface)]">
        <Badge variant="info">Corporate Profile</Badge>
        <Title as="h1" className="mt-4 max-w-4xl text-4xl text-[var(--amc-text-strong)] md:text-5xl">
          Built to Strengthen Aviation Reliability Across the Kingdom
        </Title>
        <TextBlock className="mt-5 max-w-3xl text-[var(--amc-text-body)]">
          Aerogarage Company was established in Riyadh with a strategic mandate to elevate safety, quality, and operational performance across Saudi aviation services.
        </TextBlock>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button as={Link} to="/contact">Request Company Profile</Button>
          <Button as={Link} to="/services" variant="secondary">
            Explore Operations
          </Button>
        </div>
      </Section>

      <Section>
        <Card className="about-quick-nav-wrap bg-white">
          <div className="about-quick-nav-list">
            {quickNav.map((item) => (
              <Button
                key={item.id}
                as="a"
                href={`#${item.id}`}
                variant="ghost"
                size="sm"
                className="about-quick-nav-btn"
              >
                {item.label}
              </Button>
            ))}
          </div>
        </Card>
      </Section>

      <Section
        id="about-proof"
        title="Institutional Proof Points"
        subtitle="A fast credibility snapshot for decision-makers evaluating aviation partners."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {proofPoints.map((item) => (
            <Card key={item.label} className="bg-white">
              <p className="text-sm text-[var(--amc-text-muted)]">{item.label}</p>
              <p className="mt-3 text-2xl font-[var(--amc-font-heading)] text-[var(--amc-text-strong)]">{item.value}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        id="about-pillars"
        className="bg-[var(--amc-gradient-surface)]"
        title="Strategic Pillars"
        subtitle="Core principles behind AMC's operational model and long-term reliability."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {valuePillars.map((item) => (
            <Card key={item.title} className="bg-white">
              <Badge variant="info">Core Pillar</Badge>
              <h3 className="mt-3 text-2xl">{item.title}</h3>
              <TextBlock className="mt-3">{item.detail}</TextBlock>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        id="about-timeline"
        title="Growth Timeline"
        subtitle="Structured milestones from company launch to institutional operating maturity."
      >
        <div className="grid gap-4">
          {milestones.map((item) => (
            <Card key={item.year} className="flex flex-col gap-3 border-l-4 border-l-[var(--amc-accent-600)] md:flex-row md:items-start md:gap-6">
              <p className="text-lg font-semibold text-[var(--amc-accent-600)] md:min-w-24">{item.year}</p>
              <div>
                <h3 className="text-xl">{item.title}</h3>
                <TextBlock className="mt-2">{item.detail}</TextBlock>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        id="about-partners"
        className="bg-[var(--amc-gradient-surface)]"
        title="Strategic Partnerships"
        subtitle="Collaborative relationships supporting service quality, training depth, and operational scale."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {partnerships.map((item) => (
            <Card key={item} className="bg-white">
              <Badge variant="success">Partner Network</Badge>
              <TextBlock className="mt-3">{item}</TextBlock>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <Card className="border border-[var(--amc-border)] bg-white">
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <Badge variant="info">Next Step</Badge>
              <h2 className="mt-3 text-3xl text-[var(--amc-text-strong)] md:text-4xl">
                Evaluate Aerogarage for Institutional Aviation Delivery
              </h2>
              <TextBlock className="mt-3 max-w-2xl">
                Engage our team for scope alignment, operating model review, and proposal-level discussion.
              </TextBlock>
            </div>
            <div className="grid gap-3">
              <Button as={Link} to="/contact" size="lg">Request Corporate Proposal</Button>
              <Button as={Link} to="/services" size="lg" variant="secondary">Review Service Portfolio</Button>
            </div>
          </div>
        </Card>
      </Section>
    </>
  );
}
