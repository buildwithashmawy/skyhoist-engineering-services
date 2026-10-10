import { getWhatsAppUrl, site } from "@/lib/site";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

export function WhatsAppFab() {
  return (
    <a
      href={getWhatsAppUrl(
        `Hello Skyhoist — I'd like to discuss a service inquiry.`,
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat on WhatsApp at ${site.whatsapp}`}
      className="group fixed bottom-5 right-5 z-50 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3.5 text-sm font-bold text-white shadow-[0_12px_32px_rgba(37,211,102,0.45)] transition hover:bg-[#1ebe57] hover:shadow-[0_16px_40px_rgba(37,211,102,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 md:bottom-7 md:right-7"
    >
      <span className="inline-flex size-9 items-center justify-center rounded-full bg-white/15">
        <WhatsAppIcon className="size-5" />
      </span>
      <span className="pr-1 max-sm:sr-only">WhatsApp</span>
    </a>
  );
}
