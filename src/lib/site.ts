export const site = {
  name: "Skyhoist Engineering Services",
  shortName: "SKYHOIST",
  mark: "SES®",
  tagline: "Engineering confidence for demanding industrial operations",
  description:
    "SES® provides independent engineering services that improve quality and productivity, reduce risk, verify compliance, and keep industrial operations ready.",
  intro:
    "SES® provides worldwide, independent services that make a difference. Our experts help you operate in more efficient and sustainable ways by streamlining processes, improving quality and productivity, reducing risk, verifying compliance, and increasing speed to market.",
  mission: [
    "We are constantly looking beyond customers’ and society’s expectations in order to deliver market-leading services wherever they are needed.",
    "As a provider of specialized solutions that improve quality, safety, and productivity and reduce risk, we help customers navigate an increasingly regulated world.",
    "Our independent services add significant value to customer operations and support long-term business sustainability.",
  ],
  email: "Info@skyhoistservices.com",
  website: "skyhoistservices.com",
  phones: ["+201275109220", "+201042851184"],
  /** Primary WhatsApp / chat number (same as first phone). */
  whatsapp: "+201275109220",
  address: {
    line1: "Office 201, Building 38, Al-Multaqa Al-Arabi",
    line2: "Sheraton Airport, Cairo, Egypt",
  },
  hours: {
    weekdays: "Sunday – Thursday: 8:00 AM – 5:00 PM",
    weekend: "Friday & Saturday: Closed",
  },
} as const;

export type Service = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  points: string[];
  image: string;
};

export const services: Service[] = [
  {
    slug: "inspection-services",
    title: "Inspection Services",
    summary:
      "Independent inspection programs that help facilities work with confidence.",
    description:
      "Skyhoist provides independent inspection and verification programs that help you control quality, meet regulatory requirements, and keep industrial assets safe—with clear reporting for operational decisions.",
    points: [
      "Third-party inspection and verification coverage",
      "Commissioning and periodic inspection support",
      "Safety-component testing and technical assistance",
      "Clear reporting built for operational decisions",
    ],
    image: "/images/svc-inspection.jpg",
  },
  {
    slug: "calibration-and-testing",
    title: "Calibration & Testing",
    summary:
      "Pressure, measurement, and testing support built around reliable standards.",
    description:
      "Our calibration and testing teams help keep critical instruments and systems within tolerance, reducing measurement risk and supporting safer, more accurate industrial performance.",
    points: [
      "Pressure and measurement calibration",
      "Functional and acceptance testing",
      "Traceable standards and documentation",
      "Field and workshop support options",
    ],
    image: "/images/svc-calibration.jpg",
  },
  {
    slug: "training-development",
    title: "Training & Development",
    summary: "Practical technical training for energy and industrial teams.",
    description:
      "We deliver hands-on and digital training programs that strengthen technical competency, safety awareness, and field readiness for crews working under real operational pressure.",
    points: [
      "Face-to-face and digital learning formats",
      "Technical competency development",
      "Safety-focused curriculum design",
      "Programs tailored to site requirements",
    ],
    image: "/images/svc-training.jpg",
  },
  {
    slug: "fabrication-and-welding",
    title: "Fabrication & Welding",
    summary:
      "Precision fabrication and coded welding support for plant requirements.",
    description:
      "From preparation through final inspection, Skyhoist supports fabrication and welding scopes that demand dimensional accuracy, coded procedures, and dependable quality control.",
    points: [
      "Coded welding and fabrication support",
      "Plant and site-ready workmanship",
      "Procedure-driven quality control",
      "Coordination with inspection and PWHT scopes",
    ],
    image: "/images/svc-fabrication.jpg",
  },
  {
    slug: "post-weld-heat-treatment",
    title: "Post Weld Heat Treatment",
    summary:
      "Controlled heat treatment that protects weld integrity and material performance.",
    description:
      "Our PWHT services help relieve residual stress and protect material performance after welding, supporting compliance and long-term weld integrity on critical assemblies.",
    points: [
      "Controlled thermal cycles",
      "Weld integrity and stress relief",
      "Documented process control",
      "Support for demanding plant materials",
    ],
    image: "/images/svc-pwht.jpg",
  },
  {
    slug: "wellhead-maintenance",
    title: "Wellhead Maintenance",
    summary:
      "Maintenance and inspection support for critical wellhead equipment.",
    description:
      "Skyhoist supports wellhead reliability with maintenance, inspection, and readiness services designed for high-consequence oil and gas environments.",
    points: [
      "Wellhead equipment maintenance",
      "Integrity-focused inspection support",
      "Operational readiness checks",
      "Field-responsive technical coverage",
    ],
    image: "/images/svc-wellhead.jpg",
  },
  {
    slug: "qhse-management-system",
    title: "QHSE Management System",
    summary:
      "Practical quality, health, safety, and environmental control systems.",
    description:
      "We help industrial teams build and maintain QHSE systems that are usable in the field—improving accountability, reducing risk, and strengthening compliance culture.",
    points: [
      "Quality and safety system design",
      "Practical field-ready controls",
      "Audit and continuous improvement support",
      "Clear accountability frameworks",
    ],
    image: "/images/svc-qhse.jpg",
  },
  {
    slug: "supply-and-logistics",
    title: "Supply & Logistics",
    summary:
      "Sourcing, procurement, and delivery coordination for industrial operations.",
    description:
      "Skyhoist coordinates industrial supply and logistics so materials, tools, and equipment arrive when operations need them—reducing delay and keeping projects moving.",
    points: [
      "Industrial sourcing and procurement",
      "Delivery and logistics coordination",
      "Vendor and material readiness support",
      "Project-aligned supply planning",
    ],
    image: "/images/svc-supply.jpg",
  },
  {
    slug: "rig-inspection",
    title: "Rig Inspection",
    summary:
      "Condition monitoring and integrity checks for rigs, drill pipe, and tubular equipment.",
    description:
      "Skyhoist helps operators and drilling contractors keep rigs safe and reliable—monitoring condition, detecting corrosion and fatigue before failure, and verifying operational integrity against current industry standards.",
    points: [
      "Rig, drill-pipe, and tubular condition monitoring",
      "Detection of corrosion, wall loss, and fatigue cracks",
      "Operational integrity aligned to current standards",
      "Reporting built for safe, reliable facility operation",
    ],
    image: "/images/svc-rig.jpg",
  },
  {
    slug: "tubular-inspection",
    title: "Tubular Inspection",
    summary:
      "BHA, drill-pipe, tubing, and casing inspection against client-nominated standards.",
    description:
      "From bottom-hole assemblies to drill pipe, tubing, and casing, Skyhoist delivers tubular inspection programs using methods matched to drilling conditions—supporting higher performance and fewer unexpected failures.",
    points: [
      "BHA inspection to API RP7, DS-1, NS-2, or client standards",
      "Drill-pipe EMI, magnetic-flow, and surface preparation",
      "Tubing and casing visual, drift, and thread checks",
      "Cleaning, coating, hardness, and UT wall-thickness support",
    ],
    image: "/images/svc-tubular.jpg",
  },
  {
    slug: "ndt-inspection",
    title: "NDT Inspection",
    summary:
      "Effective non-destructive testing methods for equipment and asset integrity.",
    description:
      "Skyhoist applies intrusive and non-intrusive NDT methods to find defects early, screen long pipe runs, and keep facilities operating safely—across fabrication, in-service inspection, and outage windows.",
    points: [
      "VT, PT, MT, UT, RT, ET, hardness, and vacuum-box testing",
      "PMI, remote visual inspection, and infrared thermography",
      "LRUT, PAUT, TOFD, and digital/computed radiography",
      "Fast, portable methods suited to plant and field access",
    ],
    image: "/images/svc-ndt.jpg",
  },
  {
    slug: "lifting-inspection",
    title: "Lifting Inspection",
    summary:
      "Statutory and voluntary inspection for hoisting, lifting, and material-handling equipment.",
    description:
      "Independent lifting inspections help you meet regulatory requirements, confirm safe working condition, and protect uptime—covering personnel and material-handling devices across industrial sites.",
    points: [
      "Cranes, derricks, fork-lifts, shackles, hooks, and telehandlers",
      "Elevating work platforms and related handling devices",
      "Conformity assessment to applicable standards",
      "Planned inspections that minimize operational disruption",
    ],
    image: "/images/svc-lifting.jpg",
  },
  {
    slug: "dropped-object-inspection",
    title: "Dropped Object Inspection",
    summary:
      "DROPS surveys that identify falling-object hazards offshore and onshore.",
    description:
      "Objects falling from height still cause serious incidents. Skyhoist DROPS surveys inventory at-risk items, flag immediate actions with photo evidence, and recommend ongoing maintenance to keep structures safer.",
    points: [
      "DROPS surveys from loose-item removal to full inventories",
      "Photo-backed reports with immediate-action recommendations",
      "Coverage for derricks, masts, rig equipment, and cranes",
      "Guidance for continuous dropped-object prevention",
    ],
    image: "/images/svc-drops.jpg",
  },
  {
    slug: "rope-access-inspections",
    title: "Rope Access Inspections",
    summary:
      "Safe, cost-effective access for inspection and work at height where scaffolding is impractical.",
    description:
      "Skyhoist rope-access teams deliver inspection, NDT, rigging, and fabric-maintenance scopes at height—reducing scaffolding cost and schedule while keeping IRATA-aware safe working practices front and center.",
    points: [
      "Alternative to scaffolding and MEWPs for difficult access",
      "Inspection, NDT, rigging, and fabric maintenance at height",
      "Oil & gas, petrochemical, and industrial plant coverage",
      "Time- and cost-efficient access with trained personnel",
    ],
    image: "/images/svc-rope.jpg",
  },
  {
    slug: "elevator-escalator-inspection",
    title: "Elevator & Escalator Inspection",
    summary:
      "Commissioning, periodic inspection, and certification for people-elevation systems.",
    description:
      "Sensitive passenger systems need independent supervision. Skyhoist supports elevator and escalator safety through document review, hazard analysis, component testing, and periodic inspections that help plan maintenance and reduce downtime.",
    points: [
      "Commissioning and periodic safety inspections",
      "Safety-component testing and conformity reporting",
      "Condition assessment of aging elevator systems",
      "Faster electronic testing that shortens asset downtime",
    ],
    image: "/images/svc-elevator.jpg",
  },
];

export const values = [
  {
    title: "Quality",
    text: "What we do, we do well—with measurable standards and accountability.",
  },
  {
    title: "Safety",
    text: "Every service is shaped around safer facilities, teams, and decisions.",
  },
  {
    title: "Leadership",
    text: "We help industrial clients make confident technical choices under pressure.",
  },
  {
    title: "Improvement",
    text: "Our systems keep evolving through training, audits, and better methods.",
  },
] as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

/** WhatsApp click-to-chat URL for the primary number. */
export function getWhatsAppUrl(message?: string) {
  const digits = site.whatsapp.replace(/\D/g, "");
  const url = new URL(`https://wa.me/${digits}`);
  if (message) url.searchParams.set("text", message);
  return url.toString();
}
