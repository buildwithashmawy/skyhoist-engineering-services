export type ServiceSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type Service = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  /** Short bullets used on listing cards. */
  points: string[];
  /** “How we help” outcomes shown on the detail page. */
  outcomes: string[];
  /** Expanded page sections, rephrased from reference depth. */
  sections: ServiceSection[];
  image: string;
};

/**
 * Service catalog aligned to platform-pps.com (same set and order).
 * Detail copy is original Skyhoist phrasing at similar depth to the reference pages.
 */
export const services: Service[] = [
  {
    slug: "inspection-services",
    title: "Inspection Services",
    summary:
      "Independent inspection for elevators, escalators, and safety-critical systems.",
    description:
      "Skyhoist delivers professional inspection support so passenger-transport and industrial systems stay safe, reliable, and aligned with regional and international requirements. Our teams cover commissioning checks, periodic inspections, safety-component testing, certification support, and practical technical assistance.",
    points: [
      "Elevator and escalator inspection and certification",
      "Commissioning and periodic safety inspections",
      "Hazard analysis and safety-component testing",
      "Condition assessment with clear conformity reporting",
    ],
    outcomes: [
      "Confirm systems meet applicable safety standards",
      "Reduce downtime through efficient, thorough testing",
      "Plan maintenance with lifetime-aware inspection findings",
      "Support operators with independent third-party oversight",
    ],
    sections: [
      {
        heading: "Approach & services",
        paragraphs: [
          "Elevators, escalators, and other people-moving systems deserve focused technical supervision. Even when manufacturers, installers, and site operators do their part, independent safety inspections add a high-value control at a modest share of operating cost.",
          "We review design and technical documentation, run hazard analyses, and check the safety of devices and components—including safety control systems—so you can demonstrate compliance with confidence.",
        ],
      },
      {
        heading: "Elevator & escalator inspection and certification",
        paragraphs: [
          "Skyhoist technicians examine and test elevators, escalators, and safety components against harmonized standards. After the assessment, we issue a structured test report and, where applicable, a certificate of conformity.",
          "Periodic inspections build a clear picture of system condition over time, which helps maintenance teams prioritize work, order parts earlier, and avoid unplanned outages.",
        ],
        bullets: [
          "Efficient testing that limits service interruption",
          "Examination of safety components and control systems",
          "Reports designed for operators and competent authorities",
          "Support as an independent liaison when authorities request clarification",
        ],
      },
      {
        heading: "Condition assessment of elevator systems",
        paragraphs: [
          "Beyond pass/fail checks, we assess the overall state of elevator components and the system as users experience it—appearance, ride behavior, aging effects, and spare-part availability.",
        ],
        bullets: [
          "Reliability assessment and operational behavior testing",
          "Aging and spare-parts readiness review",
          "Inspection management to help hit deadlines",
          "Coordination support with maintenance and third parties",
        ],
      },
      {
        heading: "Related inspection disciplines",
        paragraphs: [
          "When your scope expands beyond people-elevation systems, Skyhoist also fields specialist programs for rig, tubular, NDT, lifting, dropped-object, and rope-access inspection—so one technical partner can cover connected risk areas.",
        ],
      },
    ],
    image: "/images/svc-inspection.jpg",
  },
  {
    slug: "rig-inspection",
    title: "Rig Inspection",
    summary:
      "Cost-effective inspection that keeps rigs, drill pipe, and tubulars reliable.",
    description:
      "Skyhoist helps operators and drilling contractors protect safety and uptime with professional rig inspection programs. We focus on condition monitoring, early defect detection, and operational integrity against current oil and gas standards.",
    points: [
      "Rig, drill-pipe, and tubular condition monitoring",
      "Detection of corrosion, wall loss, and fatigue cracks",
      "Integrity checks against current regulations",
      "Clear reporting for safe facility operation",
    ],
    outcomes: [
      "Monitor condition of rigs, drill pipe, and tubular equipment",
      "Locate internal and external corrosion, pitting, cuts, gouges, wall loss, and fatigue cracks early",
      "Verify operational integrity against the latest applicable standards",
      "Support safe, reliable facility operation with actionable findings",
    ],
    sections: [
      {
        heading: "Why rig inspection matters",
        paragraphs: [
          "Drilling and well-construction assets work under constant mechanical and environmental stress. Small defects that go unnoticed can escalate into downtime, environmental risk, or serious incidents.",
          "Skyhoist combines specialized engineers and technicians with practical field methods so inspection programs stay cost-effective without sacrificing technical rigor.",
        ],
      },
      {
        heading: "Coverage for operators and drilling contractors",
        paragraphs: [
          "Our rig inspection support is built for major operators and drilling contractors that need dependable third-party assurance across rig structure, pipe, and oilfield tubulars.",
        ],
        bullets: [
          "Condition surveys for drilling packages and associated tubular equipment",
          "Defect detection before damage becomes severe",
          "Documentation ready for operational and compliance reviews",
          "Field teams experienced in oil and gas delivery environments",
        ],
      },
    ],
    image: "/images/svc-rig.jpg",
  },
  {
    slug: "tubular-inspection",
    title: "Tubular Inspection",
    summary:
      "BHA, drill-pipe, tubing, and casing inspection to client-nominated standards.",
    description:
      "Skyhoist tubular inspection programs help drilling teams protect performance and reduce unexpected failures. We inspect bottom-hole assemblies, specialty tools, drill pipe, tubing, and casing using methods matched to site conditions and the standards you nominate.",
    points: [
      "BHA inspection to API RP7, DS-1, NS-2, or client standards",
      "Drill-pipe EMI and magnetic-flow inspection",
      "Tubing and casing visual, drift, and thread checks",
      "Cleaning, coating, hardness, and UT wall-thickness support",
    ],
    outcomes: [
      "Keep BHA integrity aligned with drilling performance targets",
      "Apply the right inspection technique for each tubular string",
      "Catch thread, body, and wall-thickness issues before they trip operations",
      "Combine inspection with practical tubular maintenance support",
    ],
    sections: [
      {
        heading: "Bottom-hole assembly",
        paragraphs: [
          "A well-maintained BHA underpins drilling performance. Skyhoist conducts BHA inspections to API RP7, DS-1, NS-2, or other standards nominated by the commissioning client, with reporting that field teams can act on quickly.",
        ],
      },
      {
        heading: "Specialty tools",
        paragraphs: [
          "We support inspection and readiness checks for tools used in directional drilling, casing drilling, and borehole enlargement—helping specialty equipment stay fit for the next run.",
        ],
      },
      {
        heading: "Drill pipe",
        paragraphs: [
          "Drill-pipe inspection follows customer-nominated standards and techniques suited to drilling conditions and failure history. Electromagnetic inspection (EMI) is applied at intervals guided by risk, while A.C. yoke magnetic-flow methods cover many routine inspections. Sandblasting preparation is available when surface condition must be restored before examination.",
        ],
      },
      {
        heading: "Tubing and casing",
        paragraphs: [
          "For tubing and casing we cover visual body and thread examination, full-length drifting, and supporting maintenance tasks that keep tubulars ready for deployment.",
        ],
        bullets: [
          "Cleaning and coating support",
          "Hardness testing",
          "Thread gauging",
          "Ultrasonic wall-thickness measurement",
        ],
      },
    ],
    image: "/images/svc-tubular.jpg",
  },
  {
    slug: "ndt-inspection",
    title: "NDT Inspection Services",
    summary:
      "Conventional and advanced NDT to verify equipment and asset integrity.",
    description:
      "Skyhoist applies proven non-destructive testing methods to investigate asset integrity without unnecessary dismantling. From conventional shop and field techniques to advanced screening methods, we help you find defects early, protect uptime, and keep facilities operating safely across the asset life cycle.",
    points: [
      "Conventional methods: VT, PT, MT, UT, RT, ET, and more",
      "Advanced methods: LRUT, PAUT, TOFD, digital radiography, IR",
      "PMI, hardness, vacuum-box, and remote visual inspection",
      "Plant, fabrication, and in-service coverage",
    ],
    outcomes: [
      "Monitor integrity with intrusive or non-intrusive methods",
      "Detect defects before they escalate into severe damage",
      "Test efficiently at fabrication, commissioning, and in-service stages",
      "Support safe, reliable facility operation with clear NDT evidence",
    ],
    sections: [
      {
        heading: "Conventional NDT",
        paragraphs: [
          "Our conventional toolkit covers the methods most industrial programs rely on day to day—portable enough for site work and rigorous enough for fabrication and plant quality control.",
        ],
      },
      {
        heading: "Visual testing (VT)",
        paragraphs: [
          "Visual examination is performed with or without optical aids such as magnifiers, borescopes, and fiber-optic devices. Skyhoist inspectors are trained to identify surface flaws and diagnose incongruities through structured visual assessment.",
        ],
      },
      {
        heading: "Dye penetrant testing (PT)",
        paragraphs: [
          "PT is a cost-effective way to locate surface-breaking flaws—cracks, porosity, laps, seams, and similar discontinuities—in castings, forgings, and weldments. It works on ferrous and non-ferrous non-porous materials and is highly portable for site work, especially when visible color-contrast processes are used.",
        ],
      },
      {
        heading: "Magnetic particle testing (MT)",
        paragraphs: [
          "MT reveals surface and near-surface discontinuities in ferromagnetic materials using a magnetic field and magnetic particles. It is well suited to iron and steel components and can also support inspection of submerged structures such as offshore rig members, often providing an immediate indication of defects.",
        ],
      },
      {
        heading: "Ultrasonic testing (UT)",
        paragraphs: [
          "UT inspects castings, forgings, welded components, and composites across industry sectors. Applications include deep or small flaw detection, thickness measurement for erosion and corrosion monitoring, and bond-integrity assessment—with portable equipment and rapid, accurate results when interpreted by skilled technicians.",
        ],
      },
      {
        heading: "Radiographic testing (RT)",
        paragraphs: [
          "Radiography remains a primary volumetric method for revealing internal, surface, and sub-surface irregularities in welds, castings, forgings, and composites. It is widely applied in petroleum, chemical, power, construction, and aerospace work, including corrosion mapping and wall-thickness measurement.",
        ],
      },
      {
        heading: "Eddy current, hardness, vacuum box & PMI",
        bullets: [
          "Eddy current (ET): electromagnetic induction for surface and tubing inspection, plus conductivity and coating-thickness measurements",
          "Hardness testing: rebound, UCI, and bench methods (including Brinell and Rockwell) against customer-defined acceptance criteria",
          "Vacuum-box testing: tank bottom and shell-to-bottom weld evaluation aligned with API and related standards",
          "Positive material identification (PMI): rapid alloy chemistry and grade ID for parent metal and filler verification",
        ],
      },
      {
        heading: "Remote visual inspection (RVI)",
        paragraphs: [
          "RVI reaches areas that cannot be seen without major dismantling. Cameras and probes enter through small openings to reveal poor welding, corrosion pits, blockages, foreign material, and general degradation—streaming images to the inspector or a monitoring station.",
        ],
      },
      {
        heading: "Advanced NDT",
        paragraphs: [
          "When conventional methods are too slow, too limited, or impractical for access, Skyhoist deploys advanced techniques used heavily in oil and gas, power, and chemicals.",
        ],
      },
      {
        heading: "Long-range ultrasonic testing (LRUT)",
        paragraphs: [
          "Also known as guided-wave ultrasonic testing, LRUT screens long pipe runs quickly—often hundreds of meters in a day from a single location—with full pipe-wall coverage. It can be applied on operating, insulated, buried, or elevated lines, reducing excavation, insulation removal, and scaffolding.",
        ],
      },
      {
        heading: "Phased-array UT (PAUT) & TOFD",
        paragraphs: [
          "PAUT steers and focuses ultrasonic beams using multi-element probes, detecting flaws that are difficult to catch with film radiography or manual UT. It is especially valuable for new piping, pipelines, vessels, and structural welds, and for short-window outages.",
          "Time-of-flight diffraction (TOFD) provides highly reliable weld assessment for both pre-service and in-service inspection across petrochemical, oil and gas, power, and fabrication environments.",
        ],
      },
      {
        heading: "Digital / computed radiography & infrared thermography",
        paragraphs: [
          "Digital radiography captures images on phosphor plates (CR) or flat-panel detectors (DR) instead of film—useful for piping, pressure vessels, valves, and a wide range of materials.",
          "Infrared thermography maps thermal differences to highlight corrosion, erosion, insulation failures, voids, disbonds, and other anomalies before they drive unplanned outages.",
        ],
      },
    ],
    image: "/images/svc-ndt.jpg",
  },
  {
    slug: "lifting-inspection",
    title: "Lifting Inspection",
    summary:
      "Statutory and voluntary inspection for hoisting and material-handling equipment.",
    description:
      "Skyhoist provides professional statutory and voluntary lifting inspections backed by experienced technicians and the right equipment. We help you meet regulatory duties, confirm safe working condition, and protect availability of critical lifting assets.",
    points: [
      "Personnel-handling devices and elevating work platforms",
      "Cranes, derricks, fork-lifts, shackles, hooks, and telehandlers",
      "Independent inspection to applicable standards",
      "Programs that protect uptime and planned outages",
    ],
    outcomes: [
      "Meet regulatory requirements through independent inspection",
      "Assure safe working capability of cranes and hoisting equipment",
      "Maintain equipment capability and availability",
      "Maximize uptime by aligning inspections with planned outages",
    ],
    sections: [
      {
        heading: "Personnel-handling devices",
        paragraphs: [
          "Our scope includes elevators, escalators, ski lifts, cable cars, and mobile elevating work platforms—equipment where passenger or worker safety depends on disciplined third-party examination.",
        ],
      },
      {
        heading: "Material-handling devices",
        paragraphs: [
          "We inspect cranes, derricks, fork-lifts, mobile cranes, shackles, hooks, elevating platforms, telehandlers, and related lifting accessories used across industrial and energy sites.",
        ],
      },
      {
        heading: "What lifting inspection delivers",
        bullets: [
          "Independent assessment against applicable standards and engineering practice",
          "Verification of safe and proper working condition",
          "Evidence that supports continued equipment availability",
          "Inspection timing that reduces operational impact",
        ],
      },
    ],
    image: "/images/svc-lifting.jpg",
  },
  {
    slug: "dropped-object-inspection",
    title: "Dropped Object Inspection",
    summary:
      "DROPS surveys that find falling-object hazards offshore and onshore.",
    description:
      "Falling objects still cause serious injuries and fatalities on industrial sites. Skyhoist DROPS surveys identify loose, corroded, weather-damaged, or poorly secured items at height, then deliver photo-backed reports and practical recommendations for immediate and ongoing control.",
    points: [
      "Surveys from loose-item sweeps to full inventories",
      "Photo reports with immediate-action flags",
      "Coverage for derricks, masts, rigs, cranes, and flare stacks",
      "Recommendations for continuous DROPS prevention",
    ],
    outcomes: [
      "Identify non-conforming items before they fall",
      "Scale surveys from quick sweeps to full structure inventories",
      "Act on photo-supported findings immediately after the survey",
      "Build a clearer maintenance and re-inspection plan",
    ],
    sections: [
      {
        heading: "Typical dropped-object sources",
        paragraphs: [
          "Most falling items come from equipment or materials that have loosened under vibration, corroded in place, been damaged by weather, or been left insecure after construction or maintenance.",
        ],
        bullets: [
          "Loosened fasteners and fittings from vibration",
          "Corroded structural or equipment elements",
          "Weather-damaged fixtures at height",
          "Tools and materials left insecure after work",
        ],
      },
      {
        heading: "DROPS surveys",
        paragraphs: [
          "We survey all types of structures. Scope can be as focused as removing obvious loose items or as complete as a full inventory of equipment within the structure—matched to your risk profile and site access.",
        ],
      },
      {
        heading: "Detailed reporting",
        paragraphs: [
          "After each survey you receive a detailed report with photographs highlighting items that need immediate action. We also advise on non-conformances that can be corrected during or right after the survey, plus recommendations for continuous maintenance and future inspection.",
        ],
      },
      {
        heading: "Common survey areas",
        bullets: [
          "Derricks, masts, and substructure",
          "Rig equipment packages",
          "Deck and gantry cranes",
          "Flare stacks and elevated structures",
        ],
      },
    ],
    image: "/images/svc-drops.jpg",
  },
  {
    slug: "rope-access-inspections",
    title: "Rope Access Inspections",
    summary:
      "IRATA-aware rope access for inspection and work where scaffolding is impractical.",
    description:
      "Rope access is a proven alternative to scaffolding and MEWPs when traditional access is slow, costly, or simply not viable. Skyhoist rope-access teams deliver safe, efficient inspection and complementary work at height across energy and industrial sites.",
    points: [
      "Safe alternative to scaffolding and MEWPs",
      "Inspection, NDT, rigging, and fabric maintenance at height",
      "Oil & gas, petrochemical, and industrial plant coverage",
      "Trained personnel following current rope-access practice",
    ],
    outcomes: [
      "Reach difficult locations without heavy access build-ups",
      "Complete inspection and maintenance scopes faster at height",
      "Reduce scaffolding cost and schedule impact",
      "Combine access with NDT, rigging, and fabric-maintenance tasks",
    ],
    sections: [
      {
        heading: "Effective access solutions",
        paragraphs: [
          "We treat access constraints as a joint problem-solving exercise with the client—choosing rope-access techniques that keep people safe while getting the technical work done efficiently.",
        ],
      },
      {
        heading: "Training and competence",
        paragraphs: [
          "Skyhoist rope-access personnel are trained to high standards and kept current with IRATA-related practice and legislation. That competence underpins both inspection quality and on-site safety performance.",
        ],
      },
      {
        heading: "Sectors we commonly support",
        bullets: [
          "Oil and gas exploration and production",
          "Oil and gas service providers",
          "Petrochemical plants",
          "Nuclear facilities",
          "Distilleries and manufacturing plants",
        ],
      },
      {
        heading: "Techniques and complementary scopes",
        paragraphs: [
          "Rope access is relevant anywhere teams need inspection, rigging and lifting support, fabric maintenance, or mechanical work at height. It is typically faster and more cost-efficient than scaffolding for many elevated tasks.",
          "We also deliver specialist complementary services through rope access, including rigging, fabric maintenance, and NDT inspections.",
        ],
      },
    ],
    image: "/images/svc-rope.jpg",
  },
  {
    slug: "calibration-and-testing",
    title: "Calibration & Testing",
    summary:
      "Pressure, temperature, electrical, gas, dimensional, and valve calibration support.",
    description:
      "Skyhoist calibration and testing services keep critical measuring devices accurate against high-precision reference standards. From pressure gauges to gas detectors and relief valves, we help your measurement and safety systems stay trustworthy.",
    points: [
      "Pressure, temperature, and electrical device calibration",
      "Fixed and portable gas-detection sensor calibration",
      "Dimensional hand-tool calibration",
      "Valve testing and maintenance support",
    ],
    outcomes: [
      "Keep safety-critical measurements accurate and traceable",
      "Cover pressure, temperature, electrical, gas, and dimensional devices",
      "Support valve testing and maintenance across common valve types",
      "Reduce measurement risk in operations and workshops",
    ],
    sections: [
      {
        heading: "Pressure measuring devices",
        paragraphs: [
          "We calibrate a wide range of pressure devices using high-precision reference standards—from simple test gauges to calibrators with built-in electric test pumps.",
        ],
        bullets: [
          "Pressure gauges",
          "Weight indicators",
          "Pressure transmitters",
          "Pressure transducers",
          "Pressure chart recorders",
        ],
      },
      {
        heading: "Temperature device calibration",
        paragraphs: [
          "Temperature instruments need periodic calibration so process and safety decisions rest on correct readings. Skyhoist supports common temperature sensors and systems used in industrial environments.",
        ],
        bullets: [
          "Temperature sensors",
          "Heat ovens",
          "Thermocouples",
        ],
      },
      {
        heading: "Electrical measuring devices",
        paragraphs: [
          "Electrical and electronic calibration compares instrument readings against a known standard. Using precision multifunction calibrators, we cover a broad range of workshop and field instruments.",
        ],
        bullets: [
          "Welding machines",
          "SPM / RPM gauges",
          "Heating ovens and heat-treatment machines",
        ],
      },
      {
        heading: "Gas detection sensors",
        paragraphs: [
          "Because gas measurement is a direct safety control, detectors require regular calibration. We support both fixed systems and portable units.",
        ],
        bullets: [
          "Fixed gas-detection system detectors",
          "Single portable gas detectors",
          "Multi-gas portable detectors",
        ],
      },
      {
        heading: "Dimensional measuring devices",
        paragraphs: [
          "Dimensional calibration keeps hand tools and measuring instruments precise and traceable for fabrication and quality control.",
        ],
        bullets: [
          "Micrometers",
          "Vernier calipers",
          "Dial and digital indicators",
          "OD gauges",
        ],
      },
      {
        heading: "Valve testing and maintenance",
        paragraphs: [
          "We provide testing and repair support across a wide range of valve types, sizes, and pressure classes—helping sites keep relief and control valves ready for duty.",
        ],
        bullets: [
          "Spring-reset relief valves",
          "Shear-pin pressure relief valves",
          "Gate valves",
          "Pilot, control, and shutdown valves",
        ],
      },
    ],
    image: "/images/svc-calibration.jpg",
  },
  {
    slug: "training-development",
    title: "Training & Development",
    summary:
      "Public, in-house, eLearning, virtual, and blended technical training programs.",
    description:
      "Skyhoist training programs are built by subject-matter experts to strengthen competence, safety awareness, and field readiness. We deliver public courses, in-house sessions, eLearning, virtual classrooms, and blended pathways for industrial organizations.",
    points: [
      "Operations, electrical/instrument, and safety curricula",
      "Face-to-face, virtual, and blended delivery",
      "Practical courses beyond theory-only instruction",
      "Programs scaled for crews and supervisory teams",
    ],
    outcomes: [
      "Raise personal competence with expert-led programs",
      "Deliver consistent training across sites and formats",
      "Cover lifting, E&I, and safety-critical topics in one partner",
      "Connect learning to real operating conditions",
    ],
    sections: [
      {
        heading: "How we train",
        paragraphs: [
          "Our instructors move beyond theory and bring field insight into every session. That approach helps organizations develop sustainable capability—not just attendance certificates—at every level of the workforce.",
        ],
      },
      {
        heading: "Operations programs",
        bullets: [
          "Lifting supervision, rigging and slinging, appointed person, and lifting management",
          "MEWP, EOT crane, banksman/slinger, crane, and forklift operator training",
          "Scaffolding inspection",
          "Dropped-object inspection awareness",
        ],
      },
      {
        heading: "Electrical and instrument courses",
        bullets: [
          "Fundamentals and advanced instrumentation (pressure, temperature, level, flow)",
          "Instrumentation troubleshooting and commissioning",
          "Siemens PLC and Allen-Bradley ControlLogix pathways",
          "HMI/SCADA, industrial protocols, Foundation Fieldbus",
          "Actuators, control valves, safety valves, and VFDs",
          "Classic/relay logic control and hazardous-area electrical inspection",
          "E&I quality-control inspection",
        ],
      },
      {
        heading: "Safety programs",
        bullets: [
          "Confined space, fire safety, first aid/AED/CPR",
          "Defensive driving for light and heavy vehicles",
          "Working at height and fall protection",
          "Authorized gas tester, H2S and SCBA",
          "Hazard communication and lockout/tagout",
          "Scaffolding safety, erection, and dismantling",
        ],
      },
    ],
    image: "/images/svc-training.jpg",
  },
  {
    slug: "post-weld-heat-treatment",
    title: "Post Weld Heat Treatment",
    summary:
      "Oven and localized PWHT to normalize welds for severe and cyclic service.",
    description:
      "Post weld heat treatment (PWHT) normalizes completed welds so grain structure can withstand heat and cyclic service. Skyhoist supports both oven and localized PWHT approaches so projects can balance cost, schedule, and technical requirements.",
    points: [
      "Oven PWHT for efficient multi-piece cycles",
      "Localized on-site PWHT for schedule-critical scopes",
      "Support for severe and cyclic service conditions",
      "Documented thermal cycles for compliance records",
    ],
    outcomes: [
      "Relieve residual stress after welding",
      "Choose oven or localized methods for each scope",
      "Accelerate schedules when shop oven batches are not practical",
      "Document controlled PWHT cycles for project assurance",
    ],
    sections: [
      {
        heading: "Why PWHT matters",
        paragraphs: [
          "After welding, residual stresses and metallurgical changes can leave assemblies less able to handle demanding service. PWHT restores a more stable condition for long-term integrity.",
        ],
      },
      {
        heading: "PWHT oven method",
        paragraphs: [
          "Spools and fabrications can be processed in dedicated ovens where full thermal cycles are completed under controlled conditions. Oven treatment is often the most cost-effective route and allows multiple pieces to be processed together.",
        ],
      },
      {
        heading: "Localized PWHT",
        paragraphs: [
          "When components cannot leave the workface—or schedule cannot wait for oven batching—a mobile localized setup performs PWHT on site. It is typically more costly than oven treatment, but it can protect critical-path timelines and allow faster completion.",
        ],
      },
    ],
    image: "/images/svc-pwht.jpg",
  },
  {
    slug: "fabrication-and-welding",
    title: "Fabrication & Welding",
    summary:
      "Precision metal fabrication, structural steel, sheet metal, and coded piping spools.",
    description:
      "Skyhoist provides full-service metal fabrication and welding—from single piping spools to modular skids and complex assemblies—with engineering, cutting, fitting, welding, testing, finishing, painting, assembly, and installation support under one accountable delivery path.",
    points: [
      "Piping, structural steel, sheet metal, and skid fabrication",
      "Coded welders and AWS/ASME-qualified procedures",
      "GTAW, SMAW, GMAW, FCAW, and SAW process capability",
      "Turnkey support from design through installation",
    ],
    outcomes: [
      "Deliver precision fabrications within project budgets",
      "Use coded welding processes matched to the specification",
      "Scale from single spools to modular and complex assemblies",
      "Integrate testing, finishing, and installation with fabrication",
    ],
    sections: [
      {
        heading: "Full-service metal fabrication",
        paragraphs: [
          "As a full-service fabricator we supply precision metal products, heavy structural steel and plate work, sheet metal, and coded piping spool fabrications. Value-added engineering and site support keep quality high and projects on budget.",
        ],
      },
      {
        heading: "Welding capability",
        paragraphs: [
          "Our fabricators and coded welders work with GTAW, SMAW, GMAW (short-arc and pulse), FCAW, and SAW under AWS- and ASME-qualified procedures—so quality expectations are met on paper and in the weld.",
        ],
      },
      {
        heading: "Service areas",
        bullets: [
          "Piping fabrication",
          "Structural steel fabrication",
          "Sheet metal fabrication",
          "Skid and modular fabrication",
          "CNC automated material processing",
        ],
      },
    ],
    image: "/images/svc-fabrication.jpg",
  },
  {
    slug: "supply-and-logistics",
    title: "Supply & Logistics",
    summary:
      "Sourcing, procure-to-pay, spare-parts management, and cost-reduction support.",
    description:
      "Skyhoist supply and logistics services help industrial operations secure the right materials and services at the right cost and schedule. Whether you need sharper sourcing for one site or enterprise-wide supplier performance, we focus on price, service, and delivery outcomes.",
    points: [
      "Effective sourcing across site or enterprise needs",
      "Procure-to-pay process outsourcing support",
      "Spare-parts management to improve service levels",
      "Supply-chain practices that reduce total cost of ownership",
    ],
    outcomes: [
      "Drive better price, service, and delivery from suppliers",
      "Streamline requisition through payment workflows",
      "Improve spare-parts availability and customer satisfaction",
      "Unlock volume-based total-cost-of-ownership savings",
    ],
    sections: [
      {
        heading: "Sourcing",
        paragraphs: [
          "Effective sourcing—whether for a single site or across the enterprise—pushes toward the best combination of price, service, and delivery inside your supplier base.",
        ],
      },
      {
        heading: "Procure to pay (P2P)",
        paragraphs: [
          "P2P support can cover the full supplier-management and order-fulfillment chain: requisition, purchase-order processing, receiving, invoice payment, and accounting handoff.",
        ],
      },
      {
        heading: "Spare-parts management",
        paragraphs: [
          "Outsourcing spare-parts management helps improve service levels and satisfaction by keeping critical inventory more responsive to operational demand.",
        ],
      },
      {
        heading: "Cost reductions",
        paragraphs: [
          "We help implement advanced supply-chain practices that leverage organizational volume and reduce total cost of ownership—not just unit price.",
        ],
      },
    ],
    image: "/images/svc-supply.jpg",
  },
  {
    slug: "wellhead-maintenance",
    title: "Wellhead Maintenance",
    summary:
      "Preventive and integrity maintenance for oil, gas, injection, and artificial-lift wells.",
    description:
      "Skyhoist wellhead maintenance provides a complete management approach covering routine and non-routine work. We support large-scale oil, gas, water-injection, and artificial-lift wells onshore and offshore—including H2S and CO2 environments—with crews, equipment, consumables, and documentation.",
    points: [
      "Preventive and integrity maintenance programs",
      "Routine Christmas-tree and annulus valve services",
      "Non-routine repair, hot tapping, and specialty sealants",
      "Full document packages and service-record storage",
    ],
    outcomes: [
      "Run scheduled routine wellhead programs (typically 6- or 12-monthly)",
      "Protect integrity on H2S/CO2 and demanding well types",
      "Resolve non-routine defects with planned field interventions",
      "Keep as-built drawings and computerized service records current",
    ],
    sections: [
      {
        heading: "Complete wellhead maintenance management",
        paragraphs: [
          "Our offer covers management, field crews, equipment, consumables, and a comprehensive document package—so preventive and integrity maintenance is coordinated end to end rather than handled as ad-hoc callouts.",
        ],
      },
      {
        heading: "Routine maintenance",
        paragraphs: [
          "Routine work follows a method agreed with the client and is typically scheduled every six or twelve months. Standard activities include valve servicing, pressure and function testing, visual inspection, and record keeping.",
        ],
        bullets: [
          "Flush, lubricant, and sealant injection to Christmas-tree and annulus valves",
          "Pressure or inflow testing and function testing of tree and annulus valves",
          "Pressure testing of casing hanger / pack-off voids",
          "Valve actuator operation and testing",
          "Annulus-pressure recording",
          "Visual inspection of wellhead and Christmas-tree assemblies",
          "Wellhead as-built drawing compilation",
          "Computerized storage of service records",
        ],
      },
      {
        heading: "Non-routine maintenance",
        paragraphs: [
          "Non-routine work addresses items that are no longer fit for purpose. Tasks are planned to minimize production deferment and clashes with other site activities, and can include installation, refurbishment, repair, and inventory reporting.",
        ],
        bullets: [
          "Hot tapping services",
          "Valve drilling services",
          "Casing cutting services",
          "Specialty sealant services",
        ],
      },
    ],
    image: "/images/svc-wellhead.jpg",
  },
  {
    slug: "qhse-management-system",
    title: "QHSE Management System",
    summary:
      "Quality, health, safety, and environmental systems that work in the field.",
    description:
      "Health, safety, environment, and quality are core operating values for Skyhoist—and for the clients we support. We help organizations meet or exceed regulator, customer, and internal expectations through practical QHSE systems, training, and continuous improvement.",
    points: [
      "QHSE policy implementation and staff training",
      "Customer-focused quality improvement",
      "Process innovation for productivity and quality",
      "QHSE thinking embedded in service design",
    ],
    outcomes: [
      "Move beyond checkbox compliance toward continuous improvement",
      "Train teams to implement documented QHSE procedures",
      "Raise quality by aligning work to real customer needs",
      "Apply technical skill to safer, cleaner service design",
    ],
    sections: [
      {
        heading: "Our QHSE objective",
        paragraphs: [
          "Beyond compliance, Skyhoist is committed to continuous improvement that strengthens customer satisfaction, protects people, prevents pollution, conserves resources, and upholds ethical standards across the business.",
        ],
      },
      {
        heading: "How we put QHSE into practice",
        bullets: [
          "Train employees to understand, implement, and maintain QHSE policy through documented procedures and processes",
          "Pursue the highest practical quality in products and services by identifying and meeting customer needs",
          "Innovate systems and processes to improve productivity and quality together",
          "Apply technical skills to QHSE considerations in the design and engineering of services",
        ],
      },
      {
        heading: "What clients gain",
        paragraphs: [
          "The result is a QHSE framework that is usable on site—not a binder that sits on a shelf—so accountability is clearer, risk is reduced, and compliance culture strengthens over time.",
        ],
      },
    ],
    image: "/images/svc-qhse.jpg",
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
