export const SITE_URL = "https://www.aeroamc.com";

export const PUBLIC_ROUTE_MAP = [
  "/",
  "/about",
  "/services",
  "/services/aircraft-cleaning",
  "/services/pbb-operations-maintenance",
  "/services/surface-transportation",
  "/services/line-maintenance",
  "/services/aircraft-security",
  "/services/repair-shop",
  "/training",
  "/careers",
  "/contact",
];

const defaultSeo = {
  title: "Aerogarage | Aviation Services in Riyadh",
  description:
    "Aerogarage Company delivers safety-driven aviation services, training, and technical operations aligned with Saudi Vision 2030.",
  image: "/images/brand/hero-fallback.svg",
};

export const seoConfig = {
  "/": {
    title: "Aerogarage | Safety-Driven Aviation Services in Riyadh",
    description:
      "Premium aviation operations partner providing line maintenance, aircraft cleaning, infrastructure support, and training programs in Saudi Arabia.",
    image: "/images/brand/hero-fallback.svg",
  },
  "/about": {
    title: "About Aerogarage | Vision 2030-Aligned Aviation Partner",
    description:
      "Learn how Aerogarage supports Saudi aviation transformation through quality governance, operational reliability, and strategic capability growth.",
    image: "/images/brand/hero-fallback.svg",
  },
  "/services": {
    title: "Aviation Services | Aerogarage",
    description:
      "Explore AMC's integrated aviation services across cleaning, PBB operations, line maintenance, security, transportation, and shop support.",
    image: "/images/brand/service-fallback.svg",
  },
  "/services/aircraft-cleaning": {
    title: "Aircraft Cleaning Services | Aerogarage",
    description: "Transit, turnaround, deep cleaning, and hygiene programs for airline and airport operations.",
    image: "/images/brand/service-fallback.svg",
  },
  "/services/pbb-operations-maintenance": {
    title: "PBB Operations and Maintenance | Aerogarage",
    description: "Passenger boarding bridge operations and maintenance services focused on reliability and safety continuity.",
    image: "/images/brand/service-fallback.svg",
  },
  "/services/surface-transportation": {
    title: "Surface Transportation | Aerogarage",
    description: "Airside crew, baggage, and support transport services with strict safety and operational discipline.",
    image: "/images/brand/service-fallback.svg",
  },
  "/services/line-maintenance": {
    title: "Aircraft Line Maintenance | Aerogarage",
    description: "24/7 line maintenance, troubleshooting, and AOG support for safe and on-time aircraft dispatch.",
    image: "/images/brand/service-fallback.svg",
  },
  "/services/aircraft-security": {
    title: "Aircraft Security Services | Aerogarage",
    description: "Cabin search, access control, and aircraft security services for airlines and airport operators.",
    image: "/images/brand/service-fallback.svg",
  },
  "/services/repair-shop": {
    title: "Repair Shop Services | Aerogarage",
    description: "GACAR 145 licensed repair shop services for batteries, bottles, seats, and cabin component support.",
    image: "/images/brand/service-fallback.svg",
  },
  "/training": {
    title: "Training Organization | EASA Part-66 Pathways",
    description:
      "Discover AMC training pathways for EASA Part-66 B1.1 and B2 with practical development and certification-oriented outcomes.",
    image: "/images/brand/training-fallback.svg",
  },
  "/careers": {
    title: "Careers at Aerogarage | Aviation Talent Growth",
    description:
      "Join AMC to build a career in safety-critical aviation operations, technical maintenance, and infrastructure support.",
    image: "/images/brand/hero-fallback.svg",
  },
  "/contact": {
    title: "Contact Aerogarage | Sales, Careers, and Corporate Inquiries",
    description:
      "Connect with AMC sales, recruitment, or corporate teams for service requests, partnerships, and support in Riyadh.",
    image: "/images/brand/hero-fallback.svg",
  },
};

export function getSeoForPath(path) {
  return seoConfig[path] || defaultSeo;
}
