import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Certificate Portal",
    template: "%s | Skyhoist Certificates",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function CertificateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
