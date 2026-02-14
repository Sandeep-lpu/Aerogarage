import { useEffect, useState } from "react";
import Link from "../../../app/router/Link";
import { Badge, Button, Card, Section, TextBlock, Title } from "../../../components/ui";
import MediaStage from "../components/media/MediaStage";
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

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await fetchTrainingContent();
        if (!mounted) return;
        setTraining(data?.data?.training || null);
      } catch (error) {
        if (!mounted) return;
        const parsed = parseApiError(error);
        setErrorMessage(parsed.message || "Failed to load training content");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const pathways = training?.pathways || [];
  const modules = training?.modules || [];

  return (
    <>
      <Section className="bg-[var(--amc-gradient-hero)] text-white">
        <Badge className="bg-blue-100/20 text-blue-100">Training Organization</Badge>
        <Title as="h1" className="mt-4 max-w-4xl text-4xl text-white md:text-5xl">
          EASA-Aligned Engineer Development in Saudi Arabia
        </Title>
        <TextBlock className="mt-5 max-w-3xl text-blue-100">
          AMC is establishing a specialized aircraft engineer training pathway in Riyadh to build local high-skill maintenance capability for airlines and MRO operations.
        </TextBlock>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button as={Link} to="/contact">Apply for Training Intake</Button>
          <Button as={Link} to="/training/login" variant="secondary" className="border-white text-white hover:bg-white/10">
            Student Portal
          </Button>
        </div>
      </Section>

      <Section title="Training Visual Layer" subtitle="A premium but restrained 3D block that reinforces technical training credibility.">
        <MediaStage
          variant="training"
          title="Training Capability Visualization"
          description="Prepared for future integration of workshop scenes, module diagrams, and course pathway media assets."
        />
      </Section>

      <Section title="Program Tracks" subtitle="Structured pathways aligned with international licensing frameworks.">
        {loading ? <TextBlock>Loading training pathways...</TextBlock> : null}
        {errorMessage ? <TextBlock className="text-rose-700">{errorMessage}</TextBlock> : null}

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
    </>
  );
}
