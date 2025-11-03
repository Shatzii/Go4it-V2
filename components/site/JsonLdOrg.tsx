import { BRAND } from "@/content/brand";

/**
 * JSON-LD SportsOrganization schema for SEO
 * Server component - renders on every page
 */
export default function JsonLdOrg() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "name": BRAND.name,
    "description": BRAND.tagline,
    "url": BRAND.url,
    "email": BRAND.email,
    "telephone": BRAND.phoneTel.replace("tel:", ""),
    "address": [
      {
        "@type": "PostalAddress",
        "addressLocality": "Denver",
        "addressCountry": "US",
      },
      {
        "@type": "PostalAddress",
        "addressLocality": "Vienna",
        "addressCountry": "AT",
      },
      {
        "@type": "PostalAddress",
        "addressLocality": "Dallas",
        "addressCountry": "US",
      },
      {
        "@type": "PostalAddress",
        "addressLocality": "Mérida",
        "addressCountry": "MX",
      },
    ],
    "sameAs": [
      "https://instagram.com/go4itsports",
      "https://linkedin.com/company/go4it-sports",
      "https://twitter.com/go4itsports",
      "https://tiktok.com/@go4itsports",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
