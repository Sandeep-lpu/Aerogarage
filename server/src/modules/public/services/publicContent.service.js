const services = [
  {
    slug: "aircraft-cleaning",
    name: "Aircraft Cleaning Services",
    category: "Cabin and Exterior",
    summary: "Transit, turnaround, deep cleaning, and hygiene-focused aircraft appearance programs.",
  },
  {
    slug: "pbb-operations-maintenance",
    name: "PBB Operations and Maintenance",
    category: "Airport Infrastructure",
    summary: "Passenger boarding bridge operations, preventive maintenance, and reliability checks.",
  },
  {
    slug: "surface-transportation",
    name: "Surface Transportation",
    category: "Airside Mobility",
    summary: "Crew, baggage, and support transport operations under airside safety controls.",
  },
  {
    slug: "line-maintenance",
    name: "Aircraft Line Maintenance",
    category: "Technical Operations",
    summary: "Routine checks, troubleshooting, and AOG support for dispatch reliability.",
  },
  {
    slug: "aircraft-security",
    name: "Aircraft Security Services",
    category: "Security Operations",
    summary: "Cabin search, access control, and security response operations for aviation assets.",
  },
  {
    slug: "repair-shop",
    name: "Repair Shop (GACAR 145 Licensed)",
    category: "MRO Shop Services",
    summary: "Component repair/overhaul support for batteries, bottles, seats, and selected cabin items.",
  },
];

const training = {
  organization: "AMC Training Organization",
  affiliation: "Royal Jordanian Air Academy",
  pathways: [
    {
      code: "B1.1",
      title: "EASA Part-66 B1.1",
      focus: "Aeroplanes Turbine",
    },
    {
      code: "B2",
      title: "EASA Part-66 B2",
      focus: "Avionics",
    },
  ],
  modules: [
    "Theoretical Part-66 modules",
    "Practical skills workshops",
    "On-the-job training pathways",
    "Exam and certification readiness",
  ],
};

export function getServicesContent() {
  return services;
}

export function getTrainingContent() {
  return training;
}
