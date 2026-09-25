import { getGoogleProfileLinks } from '@/lib/reviews/google';
import { towns } from '@/data/towns';

const SITE = 'https://www.webminor.co.uk';

/* One business, described in several places. Every block that mentions it
   points at this @id, so crawlers join them into a single entity instead of
   reading an Organization, a LocalBusiness and three anonymous providers. */
const BUSINESS_ID = `${SITE}/#business`;
const BUSINESS_REF = { '@id': BUSINESS_ID };

/** The ten towns in the footer and on /web-design/[town]. */
const AREA_SERVED = towns.map((t) => ({ '@type': 'City', name: t.displayName }));

interface OrganizationSchemaProps {
  url?: string;
}

export function OrganizationSchema({ url = 'https://www.webminor.co.uk' }: OrganizationSchemaProps) {
  const google = getGoogleProfileLinks();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': BUSINESS_ID,
    legalName: 'Able Print Limited',
    vatID: 'GB432542811',
    name: 'WebMinor',
    url,
    logo: `${url}/images/w-mark-768.png`,
    description: 'Free website design, local SEO and Google Business Profile set-up for local businesses in Cornwall and Devon, from a one-person studio in Saltash.',
    founder: {
      '@type': 'Person',
      name: 'Adam Butcher',
      jobTitle: 'Founder & Lead Developer',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Unit 3, Gwel Avon Business Park, Gilston Road',
      addressLocality: 'Saltash',
      addressRegion: 'Cornwall',
      postalCode: 'PL12 6TW',
      addressCountry: 'GB',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+44-1752-845258',
      contactType: 'sales',
      availableLanguage: 'English',
    },
    // Add Instagram once that profile exists. Dead URLs here are worse than
    // none; the Google listing joins by itself once GOOGLE_PLACE_ID is set.
    sameAs: [
      'https://www.facebook.com/profile.php?id=61594867971057',
      ...(google ? [google.maps] : []),
    ],
    areaServed: AREA_SERVED,
    knowsAbout: ['Web Design', 'Local SEO', 'Google Business Profile', 'Google Ads'],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  /** Only prices that are printed on the same page. */
  offers?: object;
}

export function ServiceSchema({ name, description, url, offers }: ServiceSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    provider: BUSINESS_REF,
    areaServed: AREA_SERVED,
    ...(offers ? { offers } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function PersonSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Adam Butcher',
    jobTitle: 'Founder, Designer & Developer',
    description:
      '25+ years in graphic design and web development. Founder of WebMinor, designing and building every website personally rather than through an agency team.',
    url: 'https://www.webminor.co.uk/about',
    worksFor: BUSINESS_REF,
    knowsAbout: ['Web Design', 'Graphic Design', 'Local SEO'],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQPageSchemaProps {
  faqs: { question: string; answer: string }[];
}

export function FAQPageSchema({ faqs }: FAQPageSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface SpeakableSchemaProps {
  url: string;
  cssSelectors: string[];
}

export function SpeakableSchema({ url, cssSelectors }: SpeakableSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: cssSelectors,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function JsonLdScript({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify does not escape `<`; swap it for its unicode form so the
      // payload can never break out of the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

/** The one real premises. Only for pages about the business itself (home, contact). */
export function LocalBusinessSchema() {
  return (
    <JsonLdScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': BUSINESS_ID,
        name: 'WebMinor',
        description:
          'Free website design for local businesses in Cornwall and Devon, with hosting at £50 a month plus VAT. A one-person studio in Saltash.',
        url: SITE,
        image: `${SITE}/images/w-mark-768.png`,
        telephone: '+441752845258',
        email: 'hello@webminor.co.uk',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Unit 3, Gwel Avon Business Park, Gilston Road',
          addressLocality: 'Saltash',
          addressRegion: 'Cornwall',
          postalCode: 'PL12 6TW',
          addressCountry: 'GB',
        },
        // PL12 6TW's own centroid (postcodes.io); the old pair sat 1.6 km away.
        geo: { '@type': 'GeoCoordinates', latitude: 50.41761, longitude: -4.23139 },
        priceRange: 'Design free; hosting £50 a month + VAT',
        areaServed: AREA_SERVED,
        // Saturday is by appointment and Sunday closed, so neither is listed.
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '08:00',
            closes: '16:30',
          },
        ],
        founder: { '@type': 'Person', name: 'Adam Butcher' },
      }}
    />
  );
}

interface AreaServiceSchemaProps {
  name: string;
  description: string;
  /** Path from the site root, e.g. "/web-design/plymouth". */
  path: string;
  city: string;
  /** Omit when the city is its own county (Bristol). */
  county?: string;
}

/**
 * A service offered in a town where WebMinor has no premises. Google reserves
 * LocalBusiness for a real physical location, so town pages use Service + areaServed.
 */
export function AreaServiceSchema({ name, description, path, city, county }: AreaServiceSchemaProps) {
  return (
    <JsonLdScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        name,
        description,
        serviceType: 'Web design',
        url: `${SITE}${path}`,
        provider: BUSINESS_REF,
        areaServed: {
          '@type': 'City',
          name: city,
          ...(county && county !== city
            ? { containedInPlace: { '@type': 'AdministrativeArea', name: county } }
            : {}),
        },
      }}
    />
  );
}

/** Names the site in search results; mounted once in the root layout. */
export function WebSiteSchema() {
  return (
    <JsonLdScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        name: 'WebMinor',
        url: SITE,
        inLanguage: 'en-GB',
        publisher: BUSINESS_REF,
      }}
    />
  );
}

/** Trail starts after Home, which is added automatically. */
export function BreadcrumbSchema({ trail }: { trail: { name: string; path: string }[] }) {
  const items = [{ name: 'Home', path: '/' }, ...trail];
  return (
    <JsonLdScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: `${SITE}${item.path === '/' ? '' : item.path}`,
        })),
      }}
    />
  );
}
