export type { Service, ServiceSection } from "@/lib/services";
export { getService, services } from "@/lib/services";

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

/** WhatsApp click-to-chat URL for the primary number. */
export function getWhatsAppUrl(message?: string) {
  const digits = site.whatsapp.replace(/\D/g, "");
  const url = new URL(`https://wa.me/${digits}`);
  if (message) url.searchParams.set("text", message);
  return url.toString();
}
