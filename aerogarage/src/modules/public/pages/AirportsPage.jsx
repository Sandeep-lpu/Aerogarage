import { useState, useRef, useEffect } from "react";
import { Badge, Button, Card, Section, TextBlock, Title } from "../../../components/ui";
import Link from "../../../app/router/Link";

const AIRPORTS = [
  {
    name: "Prince Nayef bin Abdulaziz International Airport",
    shortName: "Prince Nayef bin Abdulaziz",
    iata: "ELQ",
    city: "Qassim",
    region: "Central Region",
    description:
      "Serving the Qassim region, this international gateway connects central Saudi Arabia to global destinations, supporting regional trade, commerce, and Vision 2030 growth.",
    passengers: "1,658,032",
    flights: "14,119",
    partners: "60",
    capacity: "1.25M",
    image: "/images/airports/qassim.jpg",
  },
  {
    name: "Al-Ula International Airport",
    shortName: "Al-Ula International",
    iata: "ULH",
    city: "Al-Ula",
    region: "Northwest Region",
    description:
      "Gateway to one of Saudi Arabia's most historically significant and breathtaking destinations. Al-Ula Airport supports the Kingdom's flagship tourism and heritage experiences.",
    passengers: "238,089",
    flights: "4,403",
    partners: "28",
    capacity: "—",
    image: "/images/airports/al-ula.jpg",
  },
  {
    name: "Abha International Airport",
    shortName: "Abha International",
    iata: "AHB",
    city: "Abha",
    region: "Asir Region",
    description:
      "An award-winning regional gateway in the south, Abha Airport is a key driver of tourism in the scenic Asir mountains, serving millions of passengers annually with world-class facilities.",
    passengers: "4,896,510",
    flights: "34,376",
    partners: "68",
    capacity: "—",
    image: "/images/airports/abha.jpg",
  },
  {
    name: "Taif International Airport",
    shortName: "Taif International",
    iata: "TIF",
    city: "Taif",
    region: "Makkah Region",
    description:
      "A vital hub for Hajj and Umrah pilgrimage traffic, Taif International Airport supports millions of religious travelers and serves as a strategic air link for the western highlands.",
    passengers: "1,507,832",
    flights: "11,662",
    partners: "43",
    capacity: "—",
    image: "/images/airports/taif.jpg",
  },
  {
    name: "Al-Jouf International Airport",
    shortName: "Al-Jouf International",
    iata: "AJF",
    city: "Al-Jouf",
    region: "Northern Region",
    description:
      "Connecting the remote northern region to the wider Kingdom under the Cluster 2 network, Al-Jouf airport is a strategic link for logistics, government operations, and regional connectivity.",
    passengers: "729,827",
    flights: "6,195",
    partners: "26",
    capacity: "—",
    image: "/images/airports/al-jouf.jpg",
  },
  {
    name: "Prince Sultan bin Abdulaziz International Airport",
    shortName: "Prince Sultan bin Abdulaziz",
    iata: "TUU",
    city: "Tabuk",
    region: "Tabuk Region",
    description:
      "With a capacity of 1.5 million passengers annually, Tabuk Airport serves the northwestern corridor and supports NEOM development traffic, tourism, and military logistics.",
    passengers: "2,636,411",
    flights: "20,480",
    partners: "50",
    capacity: "1.5M",
    image: "/images/airports/tabuk.jpg",
  },
  {
    name: "NEOM International Airport",
    shortName: "NEOM International",
    iata: "NUM",
    city: "NEOM",
    region: "Tabuk Region",
    description:
      "Supporting the world's most ambitious city development project, NEOM Airport is a forward-looking gateway aligned with Saudi Arabia's Vision 2030 and the future of sustainable aviation.",
    passengers: "231,348",
    flights: "4,308",
    partners: "14",
    capacity: "—",
    image: "/images/airports/neom.jpg",
  },
  {
    name: "Hail International Airport",
    shortName: "Hail International",
    iata: "HAS",
    city: "Hail",
    region: "Hail Region",
    description:
      "A vital air link for the Hail region in north-central Saudi Arabia, this airport connects the city to domestic and regional destinations, supporting trade, agriculture, and institutional movement.",
    passengers: "1,010,954",
    flights: "8,422",
    partners: "40",
    capacity: "—",
    image: "/images/airports/hail.jpg",
  },
  {
    name: "King Abdullah bin Abdulaziz International Airport",
    shortName: "King Abdullah bin Abdulaziz",
    iata: "GIZ",
    city: "Jazan",
    region: "Jazan Region",
    description:
      "A major hub for southern Saudi air traffic, Jazan Airport serves the country's most populated southern province with robust connectivity to domestic and international destinations.",
    passengers: "2,795,005",
    flights: "21,408",
    partners: "44",
    capacity: "—",
    image: "/images/airports/jazan.jpg",
  },
];

const TOTAL_PASSENGERS = "18,156,358";
const TOTAL_FLIGHTS = "146,165";

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function StatPill({ icon, value, label }) {
  return (
    <div className="airports-stat-pill">
      <span className="airports-stat-icon" aria-hidden="true">{icon}</span>
      <div>
        <p className="airports-stat-value">{value}</p>
        <p className="airports-stat-label">{label}</p>
      </div>
    </div>
  );
}

function AirportCard({ airport, index }) {
  const [ref, visible] = useReveal();
  const isEven = index % 2 === 0;

  return (
    <article
      ref={ref}
      className={`airports-card ${visible ? "airports-card-visible" : ""}`}
      style={{ transitionDelay: `${(index % 3) * 80}ms` }}
    >
      {/* Image */}
      <div className={`airports-card-img-wrap ${isEven ? "airports-img-right" : "airports-img-left"}`}>
        <div className="airports-card-img-inner">
          <img
            src={airport.image}
            alt={airport.name}
            className="airports-card-img"
            loading="lazy"
            decoding="async"
          />
          <div className="airports-card-img-overlay" />
          {/* IATA badge on image */}
          <div className="airports-iata-badge">
            <span className="airports-iata-code">{airport.iata}</span>
            <span className="airports-iata-label">IATA</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`airports-card-content ${isEven ? "airports-content-left" : "airports-content-right"}`}>
        <div className="airports-card-header">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="info" className="airports-region-badge">{airport.region}</Badge>
            {airport.capacity !== "—" && (
              <Badge variant="success" className="airports-capacity-badge">
                Cap: {airport.capacity}
              </Badge>
            )}
          </div>
          <h3 className="airports-card-name">{airport.shortName}</h3>
          <p className="airports-card-city">
            <span className="airports-pin-icon" aria-hidden="true">📍</span>
            {airport.city}, Saudi Arabia
          </p>
        </div>

        <TextBlock className="airports-card-desc">{airport.description}</TextBlock>

        {/* Stats row */}
        <div className="airports-stats-row">
          <StatPill icon="✈️" value={airport.flights} label="Annual Flights" />
          <StatPill icon="👥" value={airport.passengers} label="Annual Passengers" />
          <StatPill icon="🤝" value={airport.partners} label="Business Partners" />
        </div>
      </div>
    </article>
  );
}

export default function AirportsPage() {
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("All");

  const regions = ["All", ...new Set(AIRPORTS.map((a) => a.region))];

  const filtered = AIRPORTS.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.city.toLowerCase().includes(search.toLowerCase()) ||
      a.iata.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = regionFilter === "All" || a.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  return (
    <main className="amc-page-bg amc-page-bg-services">
      {/* ── Hero ── */}
      <Section className="bg-[var(--amc-gradient-surface)]">
        <Badge variant="info">Cluster 2 Network</Badge>
        <Title as="h1" className="mt-4 max-w-4xl text-4xl text-[var(--amc-text-strong)] md:text-5xl">
          International Airports Served by AMC
        </Title>
        <TextBlock className="mt-5 max-w-3xl text-[var(--amc-text-body)]">
          Aerogarage Company operates across the Cluster 2 airport network in Saudi Arabia — delivering
          precision ground handling, maintenance, and aviation support at {AIRPORTS.length} international airports
          spanning every region of the Kingdom.
        </TextBlock>

        {/* Summary stats */}
        <div className="airports-hero-stats mt-10">
          <div className="airports-hero-stat">
            <p className="airports-hero-stat-value">{AIRPORTS.length}</p>
            <p className="airports-hero-stat-label">International Airports</p>
          </div>
          <div className="airports-hero-divider" />
          <div className="airports-hero-stat">
            <p className="airports-hero-stat-value">{TOTAL_PASSENGERS}</p>
            <p className="airports-hero-stat-label">Total Annual Passengers</p>
          </div>
          <div className="airports-hero-divider" />
          <div className="airports-hero-stat">
            <p className="airports-hero-stat-value">{TOTAL_FLIGHTS}</p>
            <p className="airports-hero-stat-label">Total Annual Flights</p>
          </div>
          <div className="airports-hero-divider" />
          <div className="airports-hero-stat">
            <p className="airports-hero-stat-value">8+</p>
            <p className="airports-hero-stat-label">Regions Covered</p>
          </div>
        </div>
      </Section>

      {/* ── Filter bar ── */}
      <Section>
        <div className="airports-filter-bar">
          <div className="airports-search-wrap">
            <span className="airports-search-icon" aria-hidden="true">🔍</span>
            <input
              id="airports-search"
              type="search"
              placeholder="Search by name, city or IATA code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="airports-search-input"
              aria-label="Search airports"
            />
          </div>
          <div className="airports-region-filters">
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setRegionFilter(r)}
                className={`airports-region-btn ${regionFilter === r ? "airports-region-btn-active" : ""}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <p className="airports-result-count mt-4">
          Showing <strong>{filtered.length}</strong> of {AIRPORTS.length} airports
        </p>
      </Section>

      {/* ── Airport Cards ── */}
      <Section>
        {filtered.length > 0 ? (
          <div className="airports-list">
            {filtered.map((airport, i) => (
              <AirportCard key={airport.iata} airport={airport} index={i} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-16">
            <p className="text-4xl mb-4">✈️</p>
            <h3 className="text-xl text-[var(--amc-text-strong)]">No airports found</h3>
            <TextBlock className="mt-2">Try a different search term or region filter.</TextBlock>
            <Button className="mt-6" onClick={() => { setSearch(""); setRegionFilter("All"); }}>
              Clear Filters
            </Button>
          </Card>
        )}
      </Section>

      </main>
  );
}

