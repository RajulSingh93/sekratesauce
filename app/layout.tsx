import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

const title = "SEKRATE SAUCE — Open Format DJ · Tech House, Dubstep, Trap House";
const description =
  "SEKRATE SAUCE — open-format DJ and electronic music artist. Music, mixtapes, live, events, DJ services, DJ course and bookings.";

// Icons and share images come from the favicon, icon, apple-icon,
// opengraph-image and twitter-image files in this folder.
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title,
  description,
  applicationName: "SEKRATE SAUCE",
  openGraph: {
    type: "website",
    siteName: "SEKRATE SAUCE",
    url: "/",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
