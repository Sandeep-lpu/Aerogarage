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
  "MRO and technical activities",
];

const quickNav = [
  { id: "about-ceo", label: "Message from CEO" },
  { id: "about-proof", label: "Proof Points" },
  { id: "about-pillars", label: "Strategic Pillars" },
  { id: "about-timeline", label: "Timeline" },
  { id: "about-partners", label: "Partnerships" },
];

const partnerLogos = [
  { logo: "/images/partners/1.svg", name: "Partner 1" },
  { logo: "/images/partners/2.svg", name: "Partner 2" },
  { logo: "/images/partners/3.svg", name: "Partner 3" },
  { logo: "/images/partners/4.svg", name: "Partner 4" },
  { logo: "/images/partners/5.svg", name: "Partner 5" },
  { logo: "/images/partners/6.svg", name: "Partner 6" },
  { logo: "/images/partners/7.svg", name: "Partner 7" },
  { logo: "/images/partners/8.svg", name: "Partner 8" },
  { logo: "/images/partners/9.svg", name: "Partner 9" },
];

export default function AboutPage() {
  return (
    <main className="amc-page-bg amc-page-bg-about">
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
        <Card className="about-quick-nav-wrap bg-[var(--amc-bg-surface)]">
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

      <Section id="about-ceo">
        <Card className="amc-glass-card amc-glass-card-heavy">
          <div className="grid gap-8 lg:grid-cols-[1fr_2.5fr] items-start">
            <div className="flex flex-col items-center lg:items-start">
              <div className="overflow-hidden rounded-xl border border-white/20 shadow-md mb-5 bg-[var(--amc-bg-main)] w-[240px] md:w-full max-w-[320px]">
                <img 
                  src="/images/about/ceo.webp" 
                  alt="Dr. Essam Alassali, CEO of AMC" 
                  className="w-full h-auto aspect-square object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-[var(--amc-text-strong)]">Dr. Essam Alassali</h3>
              <Badge variant="info" className="mt-2">Chief Executive Officer</Badge>
            </div>
            
            <div className="flex flex-col gap-4 text-[var(--amc-text-body)] lg:pl-6 lg:border-l border-[var(--amc-border)]">
              <h2 className="text-3xl text-[var(--amc-accent-600)] mb-2 font-semibold font-[var(--amc-font-heading)]">
                Message from the CEO
              </h2>
              <TextBlock className="leading-relaxed text-lg">
                Welcome to AeroGarage Company, where our mission is to elevate Ground Handling and Aircraft Maintenance standards across the Kingdom of Saudi Arabia. As CEO, I am both honoured and inspired by the unwavering commitment of our team—professionals who embody excellence, precision, and a deep responsibility toward aviation safety.
              </TextBlock>
              <TextBlock className="leading-relaxed">
                In an era defined by rapid transformation, the aviation sector demands solutions that are not only robust but also forward-thinking. At AMC, we embrace this challenge with confidence. Our operations are built on a foundation of advanced technologies, highly skilled personnel, and proactive safety protocols designed to anticipate risks before they emerge. Every process, every tool, and every decision reflects our dedication to creating a secure, efficient, and trusted environment for aircraft maintenance and ground operations.
              </TextBlock>
              <TextBlock className="leading-relaxed">
                A safe ecosystem is the cornerstone of operational excellence and the key to strengthening confidence across the aviation value chain. As Saudi Arabia accelerates toward Vision 2030, we remain steadfast in our commitment to support the Kingdom’s aviation growth through innovation, strategic partnerships, and continuous investment in our people and capabilities.
              </TextBlock>
              <TextBlock className="leading-relaxed">
                Looking ahead, AMC will continue to push boundaries—adopting next-generation technologies, enhancing workforce expertise, and reinforcing our promise to uphold the highest global standards in maintenance and safety. We are confident that our contributions will play a vital role in shaping a more resilient, advanced, and future-ready aviation industry in Saudi Arabia.
              </TextBlock>
              <TextBlock className="font-semibold text-[var(--amc-text-strong)] mt-4">
                Thank you for your interest in AMC. We look forward to partnering with you in building a safer, smarter, and more secure future for aviation.
              </TextBlock>
            </div>
          </div>
        </Card>
      </Section>

      <Section
        id="about-proof"
        title="Institutional Proof Points"
        subtitle="A fast credibility snapshot for decision-makers evaluating aviation partners."
        islandHeader={true}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {proofPoints.map((item) => (
            <Card key={item.label} className="bg-[var(--amc-bg-surface)]">
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
            <Card key={item.title} className="bg-[var(--amc-bg-surface)]">
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
        islandHeader={true}
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
        className="bg-[var(--amc-gradient-surface)] brightness-[1.15]"
        title="Strategic Partnerships"
        subtitle="Collaborative relationships supporting service quality, training depth, and operational scale."
      >
        {/* Partner Logo Scrolling Marquee */}
        <div className="partner-logo-marquee-wrapper">
          <div className="partner-logo-marquee">
            {[...partnerLogos, ...partnerLogos].map((partner, idx) => (
              <div key={idx} className="partner-logo-item">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="partner-logo-img"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </div>
            ))}
          </div>
        </div>



        {/* Descriptive Partnership Cards */}
        <div className="grid gap-4 md:grid-cols-2 mt-10">
          {partnerships.map((item) => (
            <Card key={item} className="bg-[var(--amc-bg-surface)]">
              <Badge variant="success">Partner Network</Badge>
              <TextBlock className="mt-3">{item}</TextBlock>
            </Card>
          ))}
        </div>
      </Section>

      </main>
  );
}
