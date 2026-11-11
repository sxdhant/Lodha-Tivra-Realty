import { site, siteUrl } from '@/lib/site';

// Tells search engines who the business is, where it is and how to reach it (schema.org JSON-LD).
export function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: site.legalName,
    description: site.description,
    url: siteUrl,
    logo: `${siteUrl}${site.logo.original}`,
    image: `${siteUrl}/og.jpg`,
    telephone: site.phone.display,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${site.office.street}, ${site.office.area}`,
      addressLocality: site.office.city,
      addressRegion: site.office.state,
      postalCode: site.office.pin,
      addressCountry: 'IN',
    },
    areaServed: { '@type': 'City', name: 'Bengaluru' },
    sameAs: site.social.map((link) => link.href),
  };

  return (
    <script
      type="application/ld+json"
      // The "<" escape keeps a stray "</script>" in any value from ending the tag early.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  );
}
