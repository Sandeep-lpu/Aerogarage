import Link from "../../../app/router/Link";
import { Badge, Button, Card, Section, TextBlock, Title } from "../../../components/ui";

const timeline = [
  { year: "2023", title: "Company Established", detail: "Aerogarage launched in Riyadh to close critical aviation service capability gaps." },
  { year: "2024", title: "Service Portfolio Expansion", detail: "Operations extended across cleaning, line maintenance, security, and infrastructure support." },
  { year: "2025", title: "Training Organization Setup", detail: "Training partnership path established with RJAA for EASA Part-66 tracks." },
  { year: "2026", title: "Institutional Scale-Up", detail: "Quality, governance, and service continuity model aligned to enterprise procurement expectations." },
];

const trustSignals = [
  "Vision 2030-aligned strategic direction",
  "Safety and quality governance integrated into operations",
  "Regulatory compliance readiness for aviation standards",
  "Institutional operating model for airports and airlines",
];

const partnerships = [
  "Royal Jordanian Air Academy (training collaboration)",
  "Airline and airport operational partnerships",
  "Technical capability partnerships for maintenance support",
  "Local workforce development ecosystem integration",
];

export default function AboutPage() {
  return (
    <>
      <Section className="bg-[var(--amc-gradient-hero)] text-white">
        <Badge className="bg-blue-100/20 text-blue-100">Corporate Profile</Badge>
        <Title as="h1" className="mt-4 max-w-4xl text-4xl text-white md:text-5xl">
          Built to Strengthen Aviation Reliability Across the Kingdom
        </Title>
        <TextBlock className="mt-5 max-w-3xl text-blue-100">
          Aerogarage Company was established in Riyadh in 2023 with a strategic mandate to elevate safety, quality, and operational performance across aviation services.
        </TextBlock>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button as={Link} to="/contact">Request Company Profile</Button>
          <Button as={Link} to="/services" variant="secondary" className="border-white text-white hover:bg-white/10">
            Explore Operations
          </Button>
        </div>
      </Section>

      <Section title="Trust and Governance Signals" subtitle="Institutional confidence indicators for procurement and oversight teams.">
        <div className="grid gap-4 md:grid-cols-2">
          {trustSignals.map((item) => (
            <Card key={item}><TextBlock>{item}</TextBlock></Card>
          ))}
        </div>
      </Section>

      <Section className="bg-[var(--amc-gradient-surface)]" title="Growth Timeline" subtitle="A concise view of AMC development milestones.">
        <div className="grid gap-4">
          {timeline.map((item) => (
            <Card key={item.year} className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
              <p className="text-lg font-semibold text-[var(--amc-accent-600)] md:min-w-24">{item.year}</p>
              <div>
                <h3 className="text-xl">{item.title}</h3>
                <TextBlock className="mt-2">{item.detail}</TextBlock>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Strategic Partnerships and Capability Network" subtitle="Collaborative models that reinforce execution quality and workforce development.">
        <div className="grid gap-4 md:grid-cols-2">
          {partnerships.map((item) => (
            <Card key={item}><TextBlock>{item}</TextBlock></Card>
          ))}
        </div>
      </Section>
    </>
  );
}
