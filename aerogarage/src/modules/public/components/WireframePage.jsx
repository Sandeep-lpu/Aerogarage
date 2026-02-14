import { Badge, Button, Card, Section, Subtitle, TextBlock, Title } from "../../../components/ui";

export default function WireframePage({ blueprint }) {
  return (
    <>
      <Section className="bg-[var(--amc-gradient-hero)] py-18 text-white">
        <Subtitle className="text-blue-200">{blueprint.hero.eyebrow}</Subtitle>
        <Title as="h1" className="mt-3 max-w-4xl text-4xl md:text-5xl text-white">
          {blueprint.hero.title}
        </Title>
        <TextBlock className="mt-5 max-w-3xl text-blue-100">{blueprint.hero.description}</TextBlock>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg">{blueprint.hero.primaryCta}</Button>
          <Button size="lg" variant="secondary" className="border-white text-white hover:bg-white/10">
            {blueprint.hero.secondaryCta}
          </Button>
        </div>
      </Section>

      <Section
        title={`${blueprint.pageTitle} IA Wireframe`}
        subtitle={`Goal: ${blueprint.pageGoal}`}
      >
        <div className="grid gap-6">
          {blueprint.sections.map((section) => (
            <Card key={section.id} className="amc-slide-up">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Badge variant="info">Section {section.id}</Badge>
                  <h3 className="mt-3 text-xl">{section.name}</h3>
                </div>
                <Badge variant="neutral">Objective</Badge>
              </div>
              <TextBlock className="mt-3">{section.objective}</TextBlock>
              <TextBlock className="mt-4 text-slate-600">{section.contentPlaceholder}</TextBlock>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button>{section.ctaPrimary}</Button>
                <Button variant="secondary">{section.ctaSecondary}</Button>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
