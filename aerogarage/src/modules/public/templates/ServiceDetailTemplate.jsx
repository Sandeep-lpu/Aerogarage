import Link from "../../../app/router/Link";
import { Badge, Button, Card, Section, TextBlock, Title } from "../../../components/ui";

export default function ServiceDetailTemplate({ service }) {
  if (!service) {
    return (
      <main className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-lg font-semibold text-(--amc-text-strong)">Service Not Found</p>
        <p className="mt-2 text-sm text-(--amc-text-muted)">
          We couldn&apos;t find the service you&apos;re looking for. Please visit the{" "}
          <a href="/services" className="underline">Services page</a>.
        </p>
      </main>
    );
  }

  return (
    <main className={`amc-page-bg amc-page-bg-${service.slug}`}>
      <Section className="bg-(--amc-gradient-hero) text-white">
        <Badge className="amc-hero-badge">{service.category}</Badge>
        <Title as="h1" className="mt-4 max-w-4xl text-4xl text-white md:text-5xl">
          {service.name}
        </Title>
        <TextBlock className="amc-hero-lead mt-4 max-w-3xl">{service.summary}</TextBlock>
        <TextBlock className="amc-hero-support mt-4 max-w-3xl">Ideal for: {service.idealFor}</TextBlock>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button as={Link} to="/contact">{service.cta}</Button>
          <Button as={Link} to="/services" variant="secondary" className="amc-hero-secondary-btn">
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

      <Section className="bg-(--amc-gradient-surface)" title="Delivery Process" subtitle="How AMC executes this service with control and reliability.">
        <div className="grid gap-4 md:grid-cols-2">
          {service.process.map((step, index) => (
            <Card key={step}>
              <Badge variant="info">Step {index + 1}</Badge>
              <TextBlock className="mt-3">{step}</TextBlock>
            </Card>
          ))}
        </div>
      </Section>
    </main>
  );
}
