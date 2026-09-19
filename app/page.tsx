import Site from "@/components/Site";
import { email, social } from "@/lib/site-data";
import { siteUrl } from "@/lib/site-url";

// Structured data so search engines can show the logo and connect the
// artist's profiles.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "SEKRATE SAUCE",
  url: siteUrl.href,
  logo: new URL("/brand/logo-chev-square.png", siteUrl).href,
  email,
  genre: ["Tech House", "Dubstep", "Trap House", "Amapiano", "Jersey House", "UK Garage"],
  sameAs: Object.values(social),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Site year={new Date().getFullYear()} />
    </>
  );
}
