import { useCallback, useEffect, useState } from "react";
import Link from "../../../app/router/Link";
import { Badge, Button, Card, Section, Table, TextBlock, Title } from "../../../components/ui";
import { fetchServicesContent, parseApiError } from "../../../services/api/publicApi";
import { serviceComparison } from "../content/servicesCatalog";

const processFramework = [
  "Discovery and scope definition with airline/airport stakeholders",
  "Resource and compliance planning with operational risk assessment",
  "Execution with QA checkpoints and live escalation pathways",
  "Performance reporting and continuous optimization cycles",
];

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadServices = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await fetchServicesContent();
      setServices(data?.data?.services || []);
    } catch (error) {
      const parsed = parseApiError(error);
      setErrorMessage(parsed.message || "Failed to load services content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  return (
    <main className="amc-page-bg amc-page-bg-services">
      <Section className="bg-[var(--amc-gradient-hero)] text-white">
        <Badge className="amc-hero-badge">Operational Portfolio</Badge>
        <Title as="h1" className="mt-4 max-w-4xl text-4xl text-white md:text-5xl">
          Integrated Aviation Services for Enterprise Operations
        </Title>
        <TextBlock className="amc-hero-lead mt-5 max-w-3xl">
          AMC provides structured service programs across cabin operations, technical maintenance, security, and infrastructure reliability.
        </TextBlock>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button as={Link} to="/contact">Request Service Proposal</Button>
          <Button as={Link} to="/contact" variant="secondary" className="amc-hero-secondary-btn">
            Book Operations Meeting
          </Button>
        </div>
      </Section>

      <Section title="Service Hub" subtitle="Select a service lane to view detailed scope, process, and conversion path." islandHeader={true}>
        {loading ? <TextBlock>Loading services...</TextBlock> : null}
        {errorMessage ? (
          <div className="flex items-center gap-3">
            <TextBlock className="text-rose-700">{errorMessage}</TextBlock>
            <Button variant="secondary" onClick={loadServices}>Retry</Button>
          </div>
        ) : null}

        {!loading && !errorMessage ? (
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <Card key={service.slug} className="flex h-full flex-col">
                <p className="text-sm font-medium text-[var(--amc-accent-600)]">{service.category}</p>
                <h3 className="mt-2 text-2xl">{service.name}</h3>
                <TextBlock className="mt-3 flex-1">{service.summary}</TextBlock>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button as={Link} to={`/services/${service.slug}`}>View Details</Button>
                  <Button as={Link} to="/contact" variant="secondary">Contact Team</Button>
                </div>
              </Card>
            ))}
          </div>
        ) : null}
      </Section>

      <Section className="bg-[var(--amc-gradient-surface)]" title="Capability Comparison" subtitle="Quick operational comparison for enterprise decision-makers.">
        <Table
          columns={[
            { key: "metric", label: "Metric" },
            { key: "aircraftCleaning", label: "Aircraft Cleaning" },
            { key: "pbb", label: "PBB Ops" },
            { key: "line", label: "Line Maintenance" },
            { key: "security", label: "Security" },
          ]}
          data={serviceComparison}
        />
      </Section>

      <Section title="AMC Delivery Framework" subtitle="The process model used across all service engagements." islandHeader={true}>
        <div className="grid gap-4 md:grid-cols-2">
          {processFramework.map((step, index) => (
            <Card key={step}>
              <p className="text-sm font-semibold text-[var(--amc-accent-600)]">Phase {index + 1}</p>
              <TextBlock className="mt-2">{step}</TextBlock>
            </Card>
          ))}
        </div>
      </Section>
    </main>
  );
}
