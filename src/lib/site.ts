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
      "Skyhoist provides rigorous inspection coverage across rigs, tubulars, lifting equipment, NDT scopes, dropped-object surveys, rope access, and facility assets—so teams can verify integrity before risk becomes downtime.",
    points: [
      "Rig, tubular, and NDT inspection programs",
      "Lifting and dropped-object surveys",
      "Rope-access and facility inspections",
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
