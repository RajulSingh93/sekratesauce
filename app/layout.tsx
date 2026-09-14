import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "SEKRATE SAUCE — Open Format DJ · Tech House, Dubstep, Trap House",
  description:
    "SEKRATE SAUCE — open-format DJ and electronic music artist with seven years behind the decks. Music, mixtapes, live, events, DJ services, DJ course and bookings.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
