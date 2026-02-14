import { lazy, Suspense } from "react";
import { Card, TextBlock } from "../../../../components/ui";
import useInView from "../../../../hooks/useInView";
import usePrefersReducedMotion from "../../../../hooks/usePrefersReducedMotion";

const LazyScene = lazy(() => import("./scenes/AviationScene3D"));

const fallbackImages = {
  hero: "/images/brand/hero-fallback.svg",
  service: "/images/brand/service-fallback.svg",
  training: "/images/brand/training-fallback.svg",
};

function StaticFallback({ title, description, variant }) {
  return (
    <Card className="overflow-hidden p-0">
      <img
        src={fallbackImages[variant] || fallbackImages.hero}
        alt={`${title} visual fallback`}
        loading="lazy"
        className="h-[320px] w-full object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl">{title}</h3>
        <TextBlock className="mt-2">{description}</TextBlock>
      </div>
    </Card>
  );
}

export default function MediaStage({ title, description, variant = "hero" }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [stageRef, inView] = useInView({ threshold: 0.2 });

  if (prefersReducedMotion) {
    return <StaticFallback title={title} description={description} variant={variant} />;
  }

  return (
    <div ref={stageRef}>
      {!inView ? (
        <StaticFallback title={title} description={description} variant={variant} />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="h-[320px] bg-[var(--amc-primary-900)] md:h-[380px]">
            <Suspense fallback={<div className="h-full w-full animate-pulse bg-slate-200/30" />}>
              <LazyScene variant={variant} />
            </Suspense>
          </div>
          <div className="p-6">
            <h3 className="text-xl">{title}</h3>
            <TextBlock className="mt-2">{description}</TextBlock>
          </div>
        </Card>
      )}
    </div>
  );
}
