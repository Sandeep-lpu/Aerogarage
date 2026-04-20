import { useCallback, useEffect, useState } from "react";
import Link from "../../../app/router/Link";
import { Badge, Button, Card, Section, TextBlock, Title } from "../../../components/ui";
import { fetchTrainingContent, parseApiError } from "../../../services/api/publicApi";

const trust = [
  "RJAA affiliated training pathway",
  "International framework and standards alignment",
  "Career-oriented technical progression model",
  "Digital and in-person blended training delivery",
];

export default function TrainingPage() {
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadTraining = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await fetchTrainingContent();
      setTraining(data?.data?.training || null);
    } catch (error) {
      const parsed = parseApiError(error);
      setErrorMessage(parsed.message || "Failed to load training content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTraining();
  }, [loadTraining]);

  const pathways = training?.pathways || [];
  const modules = training?.modules || [];

  return (
    <main className="amc-page-bg amc-page-bg-training">
      <Section className="bg-[var(--amc-gradient-hero)] text-white">
        <Badge className="amc-hero-badge">Training Organization</Badge>
        <Title as="h1" className="mt-4 max-w-4xl text-4xl text-white md:text-5xl">
          EASA-Aligned Engineer Development in Saudi Arabia
        </Title>
        <TextBlock className="amc-hero-lead mt-5 max-w-3xl">
          AMC is establishing a specialized aircraft engineer training pathway in Riyadh to build local high-skill maintenance capability for airlines and MRO operations.
        </TextBlock>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button as={Link} to="/contact">Apply for Training Intake</Button>
          <Button as={Link} to="/training/login" variant="secondary" className="amc-hero-secondary-btn">
            Student Portal
          </Button>
        </div>
      </Section>

      <Section title="Program Tracks" subtitle="Structured pathways aligned with international licensing frameworks.">
        <div className="mb-6">
          <Badge variant="info" className="text-sm px-3 py-1 font-semibold tracking-wide">EASA B1.1 and B2</Badge>
        </div>
        {loading ? <TextBlock>Loading training pathways...</TextBlock> : null}
        {errorMessage ? (
          <div className="flex items-center gap-3">
            <TextBlock className="text-rose-700">{errorMessage}</TextBlock>
            <Button variant="secondary" onClick={loadTraining}>Retry</Button>
          </div>
        ) : null}

        {!loading && !errorMessage ? (
          <div className="grid gap-4 md:grid-cols-2">
            {pathways.map((item) => (
              <Card key={item.code}>
                <h3 className="text-xl">{item.title}</h3>
                <p className="mt-2 text-sm font-medium text-[var(--amc-accent-600)]">{item.focus}</p>
                <TextBlock className="mt-3">Licensing pathway for technical engineering capability development.</TextBlock>
              </Card>
            ))}
          </div>
        ) : null}
      </Section>

      <Section className="bg-[var(--amc-gradient-surface)]" title="Learning Experience" subtitle="Comprehensive training flow from foundation to examination.">
        <div className="grid gap-4 md:grid-cols-2">
          {modules.map((item) => (
            <Card key={item}><TextBlock>{item}</TextBlock></Card>
          ))}
        </div>
      </Section>

      <Section title="Credibility Signals" subtitle="Why enterprise stakeholders can trust this training pathway.">
        <div className="grid gap-4 md:grid-cols-2">
          {trust.map((item) => (
            <Card key={item}><TextBlock>{item}</TextBlock></Card>
          ))}
        </div>
      </Section>
    </main>
  );
}
