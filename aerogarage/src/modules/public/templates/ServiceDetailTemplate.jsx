import Link from "../../../app/router/Link";
import { Badge, Button, Card, Section, TextBlock, Title } from "../../../components/ui";

export default function ServiceDetailTemplate({ service }) {
  if (!service) return null;

  return (
    <>
      <Section className="bg-[var(--amc-gradient-hero)] text-white">
        <Badge className="bg-blue-100/20 text-blue-100">{service.category}</Badge>
        <Title as="h1" className="mt-4 max-w-4xl text-4xl text-white md:text-5xl">
          {service.name}
        </Title>
        <TextBlock className="mt-4 max-w-3xl text-blue-100">{service.summary}</TextBlock>
        <TextBlock className="mt-4 max-w-3xl text-blue-200">Ideal for: {service.idealFor}</TextBlock>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button as={Link} to="/contact">{service.cta}</Button>
          <Button as={Link} to="/services" variant="secondary" className="border-white text-white hover:bg-white/10">
            Back to Services
          </Button>
        </div>
      </Section>

      <Section title="Operational Coverage" subtitle="Defined service scope and activity lanes.">
        <div className="grid gap-4 md:grid-cols-2">
          {service.coverage.map((item) => (
            <Card key={item}>
              <TextBlock>{item}</TextBlock>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-[var(--amc-gradient-surface)]" title="Delivery Process" subtitle="How AMC executes this service with control and reliability.">
        <div className="grid gap-4 md:grid-cols-2">
          {service.process.map((step, index) => (
            <Card key={step}>
              <Badge variant="info">Step {index + 1}</Badge>
              <TextBlock className="mt-3">{step}</TextBlock>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
