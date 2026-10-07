import Image from "next/image";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

type SiteLogoProps = {
  className?: string;
  priority?: boolean;
  /** Visual height in CSS pixels; width follows the lockup aspect ratio. */
  height?: number;
};

/** Official Skyhoist lockup — transparent PNG, used as-is (no reconstructed text). */
export function SiteLogo({
  className,
  priority = false,
  height = 56,
}: SiteLogoProps) {
  const width = Math.round(height * (1537 / 1023));

  return (
    <Image
      src="/images/logo.png"
      alt={site.name}
      width={width}
      height={height}
      priority={priority}
      className={cn("h-auto w-auto object-contain", className)}
      style={{ height, width: "auto" }}
    />
  );
}
